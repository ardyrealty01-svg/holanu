/**
 * HOLANU — AI Chatbot API Route
 * Menggunakan Groq (Llama 3.1 8B) — Gratis 14.400 request/hari
 * POST /api/chat
 */
import { NextRequest, NextResponse } from 'next/server';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Simple in-memory rate limiter: max 20 req/IP/minute
const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `Kamu adalah asisten properti HOLANU yang ramah dan profesional. HOLANU adalah marketplace properti Indonesia yang menghubungkan pembeli, penjual, dan agen properti terpercaya di seluruh Indonesia.

Tugasmu:
- Membantu calon pembeli mencari properti sesuai kebutuhan dan budget
- Menjelaskan proses jual beli dan sewa properti di Indonesia
- Menjelaskan dokumen legalitas properti (SHM, HGB, AJB, dll)
- Membantu simulasi dan penjelasan KPR
- Merekomendasikan langkah-langkah untuk penjual/agen mendaftarkan properti
- Menjawab pertanyaan umum seputar properti Indonesia

Aturan:
- Selalu gunakan Bahasa Indonesia yang ramah dan mudah dipahami
- Untuk pertanyaan harga spesifik, arahkan ke fitur pencarian HOLANU
- Untuk konsultasi mendalam, arahkan ke halaman /konsultasi
- Untuk KPR, arahkan ke kalkulator di /kalkulator/kpr
- Jawab singkat dan padat (maksimal 3 paragraf)
- Jika tidak yakin, jujur dan sarankan untuk menghubungi tim HOLANU

Pengetahuan penting:
- SHM (Sertifikat Hak Milik) = sertifikat terkuat, tidak ada batas waktu
- HGB (Hak Guna Bangunan) = berlaku max 30 tahun, bisa diperpanjang
- AJB = Akta Jual Beli, dibuat di notaris/PPAT
- IMB/PBG = Izin Mendirikan Bangunan / Persetujuan Bangunan Gedung
- KPR = Kredit Pemilikan Rumah, biasanya DP 10-30%, tenor 5-30 tahun
- Biaya transaksi properti: BPHTB (5% harga jual), PPh (2.5% harga jual)`;

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json() as { messages?: { role: string; content: string }[] };
    const { messages } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    // Limit conversation history to last 10 messages to control token usage
    const trimmedMessages = messages.slice(-10);

    // Validate no message is too long (prevent token stuffing)
    for (const msg of trimmedMessages) {
      if (typeof msg.content !== 'string' || msg.content.length > 2000) {
        return NextResponse.json({ error: 'Pesan terlalu panjang' }, { status: 400 });
      }
    }

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       'llama-3.1-8b-instant',
        messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmedMessages],
        max_tokens:  600,
        temperature: 0.7,
        stream:      false,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', groqRes.status, err);
      return NextResponse.json(
        { error: 'Layanan AI sedang tidak tersedia, silakan coba lagi.' },
        { status: 503 }
      );
    }

    const data = await groqRes.json() as any;
    const reply = data.choices?.[0]?.message?.content ?? 'Maaf, tidak ada respons dari AI.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}
