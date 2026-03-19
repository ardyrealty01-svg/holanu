'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, MessageCircle, Phone, BookOpen, ExternalLink } from 'lucide-react';

const faqs = [
  { q: 'Bagaimana cara menambah listing properti?',      a: 'Buka menu Properti Saya → klik tombol "Tambah Properti Baru" → isi form 5 langkah → Publish.' },
  { q: 'Berapa lama listing saya aktif?',                a: 'Listing aktif sesuai paket yang dipilih. Paket Gold: unlimited. Paket Starter: 30 hari per listing.' },
  { q: 'Bagaimana cara upgrade paket?',                  a: 'Buka menu Langganan & Billing → pilih paket yang diinginkan → klik Upgrade → bayar via Midtrans.' },
  { q: 'Kenapa listing saya masih pending?',             a: 'Listing baru masuk moderasi otomatis. Jika tidak ada konten bermasalah, akan aktif dalam 10 menit.' },
  { q: 'Bagaimana cara mendapat badge Terverifikasi?',   a: 'Upload KTP di menu Profil → tunggu review admin maks 24 jam → badge Tier 2 otomatis aktif.' },
  { q: 'Cara menghapus listing yang sudah terjual?',     a: 'Buka Properti Saya → klik ⋮ di listing → pilih "Tandai Terjual" agar masuk riwayat sebagai social proof.' },
  { q: 'Apakah foto otomatis dikompres?',                a: 'Ya. Semua foto dikonversi ke WebP dan dikompres otomatis via ImageKit CDN untuk loading lebih cepat.' },
  { q: 'Bagaimana cara upload listing massal?',          a: 'Buka Properti Saya → klik "Import CSV" → download template → isi sesuai panduan → upload file.' },
];

import { HOLANU_WA_NUMBER } from '@/lib/contact';

const SUPPORT_WA = HOLANU_WA_NUMBER; // Update via NEXT_PUBLIC_SUPPORT_WA env var
const SUPPORT_EMAIL = 'support@holanu.id';

type Message = { from: 'agent' | 'bot'; text: string; time: string };

const now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const BOT_REPLIES: Record<string, string> = {
  default: 'Terima kasih atas pertanyaannya! Tim support kami siap membantu. Untuk respons lebih cepat, Anda bisa hubungi kami langsung via WhatsApp di bawah. 😊',
  listing: 'Untuk masalah listing, coba cek: 1) Pastikan semua field wajib terisi, 2) Foto minimal 1 buah, 3) Harga tidak boleh 0. Jika masih bermasalah, hubungi support.',
  bayar: 'Untuk masalah pembayaran, pastikan saldo/limit mencukupi. Jika transaksi gagal tapi terpotong, kirim bukti ke support@holanu.id — refund diproses 1-3 hari kerja.',
  foto: 'Foto yang diupload otomatis dikompres dan dikonversi ke WebP. Jika upload gagal, pastikan ukuran file < 10MB dan format JPG/PNG/HEIC.',
  verifikasi: 'Proses verifikasi KTP memakan waktu maks 24 jam. Pastikan foto KTP jelas dan tidak buram. Jika >24 jam belum diverifikasi, hubungi support.',
};

function getReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('listing') || t.includes('properti') || t.includes('iklan')) return BOT_REPLIES.listing;
  if (t.includes('bayar') || t.includes('payment') || t.includes('transaksi') || t.includes('refund')) return BOT_REPLIES.bayar;
  if (t.includes('foto') || t.includes('gambar') || t.includes('upload')) return BOT_REPLIES.foto;
  if (t.includes('verifikasi') || t.includes('ktp') || t.includes('tier')) return BOT_REPLIES.verifikasi;
  return BOT_REPLIES.default;
}

export default function BantuanPage() {
  const [tab, setTab]         = useState<'chat' | 'faq'>('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Halo! 👋 Saya asisten HOLANU. Ada yang bisa saya bantu? Untuk info lebih lanjut, tim support kami juga siap via WhatsApp.', time: now() },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const userMsg: Message = { from: 'agent', text: message.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    setTimeout(() => {
      const reply = getReply(userMsg.text);
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: now() }]);
    }, 800);
  };

  const openWA = () => {
    const text = encodeURIComponent('Halo, saya butuh bantuan terkait akun HOLANU saya.');
    window.open(`https://wa.me/${SUPPORT_WA}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Bantuan & Support</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tim support online
          </span>
          {' '}· Respons rata-rata &lt; 30 menit
        </p>
      </div>

      {/* Quick contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={openWA}
          className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1DB954] text-white rounded-2xl px-4 py-3 transition-colors text-left"
        >
          <MessageCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="text-sm font-bold font-sans">WhatsApp Support</p>
            <p className="text-[10px] opacity-80 font-sans">Respon tercepat</p>
          </div>
          <ExternalLink size={14} className="ml-auto flex-shrink-0 opacity-70" />
        </button>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-3 bg-white border border-[#BFDBFE] hover:border-[#1D4ED8] text-[#1E3A8A] rounded-2xl px-4 py-3 transition-colors"
        >
          <Phone size={20} className="text-[#1D4ED8] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold font-sans">Email Support</p>
            <p className="text-[10px] text-slate-400 font-sans">{SUPPORT_EMAIL}</p>
          </div>
        </a>

        <a
          href="/panduan"
          className="flex items-center gap-3 bg-white border border-[#BFDBFE] hover:border-[#1D4ED8] text-[#1E3A8A] rounded-2xl px-4 py-3 transition-colors"
        >
          <BookOpen size={20} className="text-[#1D4ED8] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold font-sans">Panduan Lengkap</p>
            <p className="text-[10px] text-slate-400 font-sans">Artikel & tutorial</p>
          </div>
        </a>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {[
          { key: 'chat', label: '💬 Chat Asisten' },
          { key: 'faq',  label: '❓ FAQ' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all ${
              tab === t.key ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CHAT TAB */}
      {tab === 'chat' && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden flex flex-col" style={{ height: '440px' }}>
          {/* Header */}
          <div className="bg-[#1E3A8A] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🏠</div>
            <div>
              <p className="text-sm font-bold text-white font-sans">Asisten HOLANU</p>
              <p className="text-[10px] text-blue-200 font-sans">Tanya apa saja seputar fitur platform</p>
            </div>
            <button
              onClick={openWA}
              className="ml-auto flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DB954] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors font-sans"
            >
              <ExternalLink size={10} /> Live Support WA
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed font-sans ${
                  msg.from === 'agent'
                    ? 'bg-[#1D4ED8] text-white rounded-br-sm'
                    : 'bg-[#F0F4FF] text-slate-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                  <p className={`text-[9px] mt-1 ${msg.from === 'agent' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-[#BFDBFE] flex-shrink-0">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-[#BFDBFE] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] placeholder-slate-300 font-sans"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-9 h-9 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAQ TAB */}
      {tab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8FAFF] transition-colors"
      >
        <span className="text-sm font-semibold text-[#1E3A8A] font-sans pr-4">{q}</span>
        <span className={`text-[#1D4ED8] text-lg flex-shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 font-sans leading-relaxed border-t border-[#F1F5F9]">
          {a}
        </div>
      )}
    </div>
  );
}
