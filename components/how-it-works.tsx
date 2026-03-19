'use client';

import { useState } from 'react';
import { Search, Eye, MessageCircle, UserPlus, PlusCircle, TrendingUp, ArrowRight } from 'lucide-react';

const PENCARI = [
  { step: '01', icon: Search,        title: 'Cari Properti',          desc: 'Gunakan filter lokasi cascading, harga, dan tipe untuk menemukan properti yang tepat.' },
  { step: '02', icon: Eye,           title: 'Lihat Detail Lengkap',   desc: 'Cek foto, spesifikasi, lokasi di peta interaktif, dan profil agen sebelum memutuskan.' },
  { step: '03', icon: MessageCircle, title: 'Hubungi via WhatsApp',   desc: 'Daftar gratis lalu klik tombol WhatsApp — langsung terhubung dengan agen atau pemilik.' },
];

const AGEN = [
  { step: '01', icon: UserPlus,   title: 'Daftar Gratis',      desc: 'Buat akun HOLANU dan lengkapi profil agen dalam 5 menit. Tidak butuh kartu kredit.' },
  { step: '02', icon: PlusCircle, title: 'Pasang Listing',     desc: 'Upload foto, isi detail, dan dapatkan kode listing unik otomatis. AI bantu estimasi harga.' },
  { step: '03', icon: TrendingUp, title: 'Terima Lead WA',     desc: 'Listing tampil di pencarian, calon pembeli hubungi langsung ke WhatsApp kamu.' },
];

export function HowItWorks() {
  const [tab, setTab] = useState<'pencari' | 'agen'>('pencari');
  const steps = tab === 'pencari' ? PENCARI : AGEN;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A]">Cara Kerja HOLANU</h2>
          <p className="text-slate-500 text-sm font-sans mt-2">Mudah, cepat, dan langsung terhubung</p>
        </div>

        {/* Tab */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-1">
            {(['pencari', 'agen'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold font-sans transition-all ${
                  tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
                }`}
              >
                {t === 'pencari' ? 'Untuk Pencari Properti' : 'Untuk Agen & Pemilik'}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-0 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-[#BFDBFE] z-0" style={{ left: '16.7%', right: '16.7%' }} />

          {steps.map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="relative flex flex-col items-center text-center px-4">
              {/* Step circle */}
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#1E3A8A] flex flex-col items-center justify-center mb-4 shadow-lg border border-[rgba(186,230,253,0.2)]">
                <Icon size={24} className="text-[#BAE6FD] mb-0.5" />
                <span className="text-[9px] font-bold text-[#BAE6FD] font-mono opacity-60">{step}</span>
              </div>

              {/* Connector arrow (between cards) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 z-10 text-[#BFDBFE] translate-x-1/2">
                  <ArrowRight size={16} />
                </div>
              )}

              <h3 className="font-heading font-bold text-[#1E3A8A] mb-2">{title}</h3>
              <p className="text-sm text-slate-500 font-sans leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
