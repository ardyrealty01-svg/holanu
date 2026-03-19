'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Check } from 'lucide-react';

interface RegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'contact' | 'save' | 'message';
}

const TITLES = {
  contact: 'Daftar Gratis untuk Melihat Kontak Agen',
  save:    'Daftar untuk Menyimpan Properti Favorit',
  message: 'Daftar untuk Menghubungi Agen',
};

const BENEFITS = [
  'Akses kontak semua agen & pemilik properti',
  'Simpan listing favorit kapan saja',
  'Notifikasi listing baru sesuai kriteria',
  'Riwayat properti yang pernah dilihat',
];

export function RegisterPopup({ isOpen, onClose, trigger = 'contact' }: RegisterPopupProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full bg-white z-10 ${
        isMobile
          ? 'rounded-t-2xl pb-safe max-h-[85vh] overflow-y-auto'
          : 'rounded-2xl max-w-md mx-4 shadow-2xl'
      }`}>
        {/* Drag handle (mobile) */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-[#EFF6FF] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 pt-5">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#DBEAFE] flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">🏡</span>
          </div>

          {/* Title */}
          <h2 className="font-heading font-bold text-xl text-[#1E3A8A] text-center mb-1">
            {TITLES[trigger]}
          </h2>
          <p className="text-sm text-slate-500 font-sans text-center mb-5">
            Bergabung dengan <strong className="text-[#1D4ED8]">10.000+</strong> pengguna HOLANU
          </p>

          {/* Benefits */}
          <div className="space-y-2 mb-5">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-[#1D4ED8]" strokeWidth={2.5} />
                </div>
                <span className="text-xs text-[#1E3A8A] font-sans">{b}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 border border-[#BFDBFE] rounded-xl py-3 text-sm font-medium text-[#1E3A8A] hover:bg-[#EFF6FF] transition-colors font-sans">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#BFDBFE]" />
              <span className="text-xs text-slate-400 font-sans">atau</span>
              <div className="flex-1 h-px bg-[#BFDBFE]" />
            </div>

            <Link
              href="/daftar"
              className="block w-full text-center bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-3 rounded-xl transition-colors font-sans text-sm"
            >
              Daftar dengan Email — Gratis
            </Link>
          </div>

          <p className="text-center text-xs text-slate-400 mt-3 font-sans">
            Sudah punya akun?{' '}
            <Link href="/masuk" className="text-[#1D4ED8] font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>

          {/* Konsultasi alternatif */}
          <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
            <p className="text-center text-[10px] text-slate-400 font-sans mb-2">
              Belum siap daftar? Mau tanya dulu?
            </p>
            <Link
              href="/konsultasi"
              className="block w-full text-center text-xs font-semibold text-[#1D4ED8] bg-[#DBEAFE] hover:bg-[#BFDBFE] py-2.5 rounded-xl transition-colors font-sans"
            >
              💬 Konsultasi Properti Gratis — Tanpa Daftar
            </Link>
          </div>

          <p className="text-center text-[10px] text-slate-300 mt-3 font-sans">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="/syarat-ketentuan" className="hover:text-[#1D4ED8]">Syarat & Ketentuan</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
