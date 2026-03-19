'use client';

import Link from 'next/link';
import { ArrowRight, UserPlus } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-14 md:py-20 bg-[#1E3A8A] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1D4ED8] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#1D4ED8] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] text-[#BAE6FD] border border-[rgba(29,78,216,0.25)] text-[10px] font-bold px-3 py-1.5 rounded-full mb-4">
              Untuk Agen & Pemilik Properti
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-white font-semibold leading-tight mb-4">
              Pasang Iklan Propertimu,{' '}
              <span className="text-[#BAE6FD]">Gratis Selamanya</span>
            </h2>
            <ul className="space-y-2.5 mb-7">
              {[
                'Upload hingga 3 listing gratis tanpa batas waktu',
                'Langsung terhubung ke ribuan pencari properti',
                'Analitik views & inquiry real-time di dashboard',
                'Upgrade kapan saja jika butuh lebih banyak fitur',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#CBD5E0] font-sans">
                  <span className="text-[#BAE6FD] text-base leading-none">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/daftar"
                className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold px-6 py-3 rounded-xl transition-colors font-sans text-sm"
              >
                <UserPlus size={16} /> Daftar & Pasang Iklan Gratis
              </Link>
              <Link
                href="/dashboard/langganan"
                className="flex items-center gap-2 text-[#BAE6FD] hover:text-[#93C5FD] font-semibold text-sm font-sans transition-colors"
              >
                Lihat Paket Berbayar <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right — decorative stat cards */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              { label: 'Properti Aktif',       value: '3.891', icon: '🏠' },
              { label: 'Agen Terdaftar',        value: '1.247', icon: '👔' },
              { label: 'Inquiry Hari Ini',      value: '89',    icon: '💬' },
              { label: 'Avg. Views / Listing',  value: '234',   icon: '👁️' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(29,78,216,0.15)] rounded-2xl p-4">
                <span className="text-2xl mb-2 block">{icon}</span>
                <p className="font-heading font-bold text-2xl text-[#BAE6FD]">{value}</p>
                <p className="text-xs text-[#94A3B8] font-sans mt-0.5">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
