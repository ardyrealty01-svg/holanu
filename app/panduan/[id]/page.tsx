import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { articles } from '@/lib/data';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from 'lucide-react';

export default function PanduanDetailPage({ params }: { params: { id: string } }) {
  const article = articles.find(a => a.id === params.id) ?? articles[0];

  const RELATED = articles.filter(a => a.id !== params.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back */}
          <Link href="/panduan" className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#1D4ED8] mb-6 font-sans transition-colors">
            <ArrowLeft size={14} /> Kembali ke Panduan
          </Link>

          {/* Hero area */}
          <div className="bg-[#1E3A8A] rounded-2xl h-52 flex items-center justify-center mb-6 relative overflow-hidden">
            <span className="text-7xl opacity-20">📰</span>
            <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-md ${
              article.category === 'Investment' ? 'bg-emerald-50 text-emerald-700' :
              article.category === 'Market Insights' ? 'bg-amber-50 text-amber-700' :
              'bg-blue-50 text-blue-700'
            }`}>{article.category}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Article content */}
            <article className="lg:col-span-2">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A] leading-tight mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-sans mb-6 pb-6 border-b border-[#BFDBFE]">
                <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> 5 menit baca</span>
                <div className="ml-auto flex gap-2">
                  <button className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors">
                    <Share2 size={12} /> Bagikan
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors">
                    <Bookmark size={12} /> Simpan
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none text-slate-600 font-sans leading-relaxed space-y-4">
                <p className="text-base text-[#1E3A8A] font-semibold">{article.excerpt}</p>
                <p>Membeli properti pertama adalah salah satu keputusan finansial terbesar dalam hidup seseorang. Proses ini membutuhkan persiapan matang, mulai dari keuangan, pemilihan lokasi, hingga aspek legalitas yang perlu diperhatikan dengan seksama.</p>
                <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">1. Persiapkan Keuangan Anda</h2>
                <p>Langkah pertama adalah memastikan kondisi keuangan Anda siap. Idealnya, cicilan KPR tidak melebihi 30% penghasilan bulanan. Siapkan juga dana darurat minimal 6 bulan pengeluaran sebelum mengambil KPR.</p>
                <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">2. Pilih Lokasi yang Tepat</h2>
                <p>Lokasi adalah faktor terpenting dalam investasi properti. Pertimbangkan aksesibilitas, fasilitas terdekat (sekolah, rumah sakit, pusat perbelanjaan), dan potensi kenaikan harga area tersebut dalam 5-10 tahun ke depan.</p>
                <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">3. Pahami Aspek Legalitas</h2>
                <p>Pastikan properti yang dibeli memiliki sertifikat yang jelas (SHM lebih aman dari HGB). Verifikasi keaslian dokumen melalui PPAT/Notaris sebelum melakukan transaksi. Jangan ragu untuk meminta bantuan profesional.</p>
                <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">4. Manfaatkan Platform Digital</h2>
                <p>Platform properti seperti HOLANU memudahkan Anda menemukan properti yang sesuai dengan budget dan kebutuhan. Gunakan filter canggih dan fitur kalkulator KPR untuk membantu pengambilan keputusan.</p>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-4">
                <h3 className="font-heading font-semibold text-[#1E3A8A] mb-3 text-sm">Artikel Terkait</h3>
                <div className="space-y-3">
                  {RELATED.map(a => (
                    <Link key={a.id} href={`/panduan/${a.id}`} className="block group">
                      <p className="text-xs font-semibold text-[#1E3A8A] line-clamp-2 group-hover:text-[#1D4ED8] transition-colors leading-snug">{a.title}</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-1">{a.date}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-[#1E3A8A] rounded-2xl p-4 text-center">
                <p className="text-xs text-white font-heading font-semibold mb-1">Cari Properti Sekarang</p>
                <p className="text-[10px] text-[#94A3B8] font-sans mb-3">Temukan ribuan listing di seluruh Indonesia</p>
                <Link href="/jual" className="block bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs py-2.5 rounded-xl transition-colors font-sans">
                  Mulai Cari Properti
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-[#BFDBFE] p-4">
                <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">Kalkulator Cepat</p>
                <Link href="/kalkulator/kpr" className="block text-center bg-[#DBEAFE] text-[#1D4ED8] font-bold text-xs py-2.5 rounded-xl hover:bg-[#BFDBFE] transition-colors font-sans">
                  💰 Hitung Cicilan KPR
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
