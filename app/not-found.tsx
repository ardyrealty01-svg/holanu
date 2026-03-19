import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-[#EFF6FF]">
        <div className="text-center px-4 max-w-md">
          <p className="text-7xl mb-4">🏚️</p>
          <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-slate-500 font-sans mb-6 text-sm leading-relaxed">
            Halaman yang kamu cari tidak tersedia atau sudah dipindahkan. Mungkin properti yang kamu incar sudah terjual!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold px-6 py-3 rounded-xl transition-colors font-sans text-sm"
            >
              🏠 Kembali ke Beranda
            </Link>
            <Link
              href="/jual"
              className="border border-[#1D4ED8] text-[#1D4ED8] hover:bg-[#DBEAFE] font-semibold px-6 py-3 rounded-xl transition-colors font-sans text-sm"
            >
              Lihat Listing Properti
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
