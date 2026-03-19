import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col">

      {/* Auth Navbar — sederhana, tidak menggunakan Navbar utama */}
      <nav className="bg-white border-b border-[#BFDBFE] px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <span className="font-display font-bold text-xl text-[#1E3A8A]">HOLANU</span>
          <span className="text-[#94A3B8] text-xs font-sans hidden sm:inline">Marketplace Properti</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-[#1D4ED8] font-sans transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </nav>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="border-t border-[#BFDBFE] bg-white text-slate-400 text-xs text-center py-4 font-sans">
        © 2025 HOLANU. Semua hak dilindungi. ·{' '}
        <Link href="/syarat-ketentuan" className="hover:text-[#1D4ED8] transition-colors">Syarat & Ketentuan</Link>
        {' '} · {' '}
        <Link href="/kebijakan-privasi" className="hover:text-[#1D4ED8] transition-colors">Kebijakan Privasi</Link>
      </footer>
    </div>
  );
}
