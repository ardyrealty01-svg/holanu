import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { buildWaUrl } from '@/lib/contact';

const FAQS = [
  {
    category: 'Umum',
    items: [
      { q: 'Apa itu HOLANU?',                         a: 'HOLANU adalah platform marketplace properti digital Indonesia yang mempertemukan penjual, pembeli, penyewa, dan agen properti dalam satu ekosistem yang cepat dan mudah digunakan.' },
      { q: 'Apakah HOLANU gratis?',                   a: 'Ya! Daftar akun dan pasang hingga 3 listing pertama sepenuhnya gratis. Kami menyediakan paket premium untuk agen yang butuh lebih banyak fitur.' },
      { q: 'Bagaimana cara mendaftar?',               a: 'Klik tombol "Daftar Gratis" di navbar, isi form pendaftaran, verifikasi nomor WhatsApp dengan OTP, dan klik link konfirmasi di email.' },
    ],
  },
  {
    category: 'Listing & Properti',
    items: [
      { q: 'Bagaimana cara memasang iklan properti?', a: 'Login ke dashboard, klik "Tambah Properti Baru", isi form 5 langkah (harga, lokasi, spesifikasi, foto, deskripsi), lalu klik Publish.' },
      { q: 'Berapa lama listing saya aktif?',         a: 'Listing aktif sesuai paket. Paket Starter: unlimited (maks 3 listing). Paket Pro dan Gold: unlimited listing tanpa batas waktu.' },
      { q: 'Apakah foto saya aman di HOLANU?',        a: 'Semua foto diproses dan disimpan di CDN ImageKit.io yang terenkripsi. Foto dikonversi ke format WebP untuk performa terbaik.' },
    ],
  },
  {
    category: 'Keamanan & Verifikasi',
    items: [
      { q: 'Apa itu sistem Tier Verifikasi?',         a: 'Tier 1: Email + WA OTP. Tier 2: Upload KTP. Tier 3: Selfie + KTP. Semakin tinggi tier, semakin banyak kepercayaan dari pengguna lain.' },
      { q: 'Bagaimana cara mendapat badge Terverifikasi?', a: 'Upload KTP di menu Profil & Pengaturan. Admin akan memverifikasi dalam 24 jam. Setelah disetujui, badge Tier 2 otomatis aktif.' },
    ],
  },
  {
    category: 'Pembayaran',
    items: [
      { q: 'Metode pembayaran apa yang tersedia?',    a: 'QRIS, Virtual Account (BCA, BNI, BRI, Mandiri), GoPay, OVO, ShopeePay, DANA, kartu kredit/debit, Alfamart & Indomaret.' },
      { q: 'Apakah bisa refund?',                     a: 'Permintaan refund dalam 24 jam setelah pembayaran eligible untuk full refund. Setelah 24 jam, refund tergantung kebijakan yang berlaku.' },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2 text-center">Pertanyaan Umum</h1>
        <p className="text-slate-500 font-sans text-center mb-10">Temukan jawaban atas pertanyaan yang sering ditanyakan</p>

        <div className="space-y-8">
          {FAQS.map(({ category, items }) => (
            <div key={category}>
              <h2 className="font-heading font-bold text-[#1D4ED8] text-sm uppercase tracking-wider mb-3">{category}</h2>
              <div className="space-y-2">
                {items.map(({ q, a }) => (
                  <details key={q} className="group bg-white border border-[#BFDBFE] rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#1E3A8A] font-heading select-none list-none hover:bg-[#F8FAFF] transition-colors">
                      {q}
                      <span className="text-[#1D4ED8] text-xl leading-none ml-3 flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-sm text-slate-600 font-sans leading-relaxed border-t border-[#F1F5F9]">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#1E3A8A] rounded-2xl p-6 text-center">
          <p className="text-white font-heading font-semibold mb-2">Masih ada pertanyaan?</p>
          <p className="text-[#94A3B8] text-sm font-sans mb-4">Tim support kami siap membantu kamu</p>
          <a
            href={buildWaUrl('Halo, saya ingin bertanya tentang HOLANU.')}
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#1DB954] transition-colors font-sans"
          >
            💬 Chat WhatsApp Support
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
