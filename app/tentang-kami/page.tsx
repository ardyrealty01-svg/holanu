import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">

        {/* Hero */}
        <div className="bg-[#1E3A8A] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-display font-bold text-3xl text-[#1D4ED8] block mb-2">HOLANU</span>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Platform Properti Digital Indonesia Generasi Baru
            </h1>
            <p className="text-[#CBD5E0] font-sans text-base leading-relaxed">
              Dibangun dari nol dengan filosofi <em>mobile-first, speed-first, dan people-first</em>.
              HOLANU mempertemukan semua pihak dalam ekosistem properti yang cepat, aman, dan modern.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">

          {/* Visi */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-6 shadow-sm">
            <h2 className="font-heading font-bold text-xl text-[#1D4ED8] mb-3">🎯 Visi</h2>
            <p className="text-slate-600 font-sans leading-relaxed">
              Menjadi platform properti paling dipercaya, paling cepat, dan paling relevan di Indonesia —
              khususnya untuk kota-kota tier 2 dan 3 yang selama ini underserved oleh kompetitor besar.
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-6 shadow-sm">
            <h2 className="font-heading font-bold text-xl text-[#1D4ED8] mb-3">🚀 Misi</h2>
            <ul className="space-y-2">
              {[
                'Menyederhanakan proses jual, beli, dan sewa properti bagi semua kalangan',
                'Memberikan informasi properti yang akurat, terkini, dan hyperlocal sampai level kelurahan',
                'Menghubungkan pengguna dengan agen terpercaya secara langsung dan instan via WhatsApp',
                'Menjadi sumber edukasi properti terlengkap untuk first-time buyer Indonesia',
                'Memberikan agen dan pemilik properti tools setara platform enterprise dengan harga terjangkau',
              ].map(m => (
                <li key={m} className="flex items-start gap-2.5 text-sm text-slate-600 font-sans">
                  <span className="text-[#1D4ED8] mt-0.5">✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-6 shadow-sm">
            <h2 className="font-heading font-bold text-xl text-[#1D4ED8] mb-3">⚡ Teknologi</h2>
            <p className="text-sm text-slate-600 font-sans mb-4 leading-relaxed">
              HOLANU dibangun di atas infrastruktur edge computing Cloudflare yang memiliki 300+ titik jaringan global,
              memastikan kecepatan loading konsisten di seluruh Indonesia — termasuk daerah dengan koneksi terbatas.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Next.js 14 App Router',
                'Cloudflare Pages',
                'Cloudflare D1 (SQLite)',
                'Cloudflare Workers AI',
                'ImageKit.io CDN',
                'Midtrans Payment',
              ].map(tech => (
                <span key={tech} className="text-xs font-semibold font-mono bg-[#EFF6FF] border border-[#BFDBFE] text-slate-600 px-3 py-2 rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold px-8 py-3.5 rounded-xl transition-colors font-sans"
            >
              Bergabung dengan HOLANU
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
