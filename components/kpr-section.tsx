'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

const BANKS = ['BCA', 'BRI', 'BNI', 'Mandiri', 'BTN'];

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export function KPRSection() {
  const [harga,    setHarga]    = useState(600000000);
  const [dpPct,    setDpPct]    = useState(20);
  const [tenor,    setTenor]    = useState(20);
  const [bunga,    setBunga]    = useState(10.5);

  const dp       = Math.round(harga * dpPct / 100);
  const pokok    = harga - dp;
  const cicilan  = Math.round((pokok * (bunga / 100 / 12)) / (1 - Math.pow(1 + bunga / 100 / 12, -tenor * 12)));
  const total    = cicilan * tenor * 12;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                <Calculator size={18} className="text-[#1D4ED8]" />
              </div>
              <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider font-sans">Kalkulator KPR</span>
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A] mb-3">
              Hitung Cicilan KPR Sekarang
            </h2>
            <p className="text-slate-500 text-sm font-sans leading-relaxed mb-6">
              Simulasikan kemampuan cicilan sebelum memutuskan membeli properti. Bandingkan berbagai skenario DP dan tenor.
            </p>

            {/* Bank logos */}
            <div>
              <p className="text-xs text-slate-400 font-sans mb-2">Tersedia perbandingan rate dari:</p>
              <div className="flex gap-2 flex-wrap">
                {BANKS.map(b => (
                  <span key={b} className="text-[10px] font-bold bg-[#EFF6FF] border border-[#BFDBFE] text-slate-500 px-3 py-1.5 rounded-lg">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl">
              <p className="text-xs text-slate-400 font-sans">💡 <strong className="text-[#1E3A8A]">Tips:</strong> Cicilan ideal tidak melebihi 30% penghasilan bulanan. Pastikan ada dana darurat sebelum mengambil KPR.</p>
            </div>
          </div>

          {/* Right — calculator */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 shadow-sm">

            {/* Harga */}
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1E3A8A] font-sans">Harga Properti</label>
                <span className="text-xs font-bold text-[#1D4ED8] font-mono">{formatRp(harga)}</span>
              </div>
              <input
                type="range" min={100000000} max={5000000000} step={50000000}
                value={harga} onChange={e => setHarga(+e.target.value)}
                className="w-full accent-[#1D4ED8]"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                <span>Rp 100 Jt</span><span>Rp 5 Miliar</span>
              </div>
            </div>

            {/* DP */}
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1E3A8A] font-sans">Uang Muka (DP)</label>
                <span className="text-xs font-bold text-[#1D4ED8] font-mono">{dpPct}% — {formatRp(dp)}</span>
              </div>
              <input
                type="range" min={10} max={50} step={5}
                value={dpPct} onChange={e => setDpPct(+e.target.value)}
                className="w-full accent-[#1D4ED8]"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                <span>10% (min)</span><span>50%</span>
              </div>
            </div>

            {/* Tenor + Bunga */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Tenor</label>
                <select
                  value={tenor} onChange={e => setTenor(+e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-white font-sans"
                >
                  {[5, 10, 15, 20, 25, 30].map(t => (
                    <option key={t} value={t}>{t} tahun</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Suku Bunga</label>
                <div className="relative">
                  <input
                    type="number" step={0.1} min={5} max={20}
                    value={bunga} onChange={e => setBunga(+e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-white font-sans"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-sans">%/thn</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="bg-[#1E3A8A] rounded-2xl p-4 text-center mb-4">
              <p className="text-xs text-[#94A3B8] font-sans mb-1">Estimasi Cicilan per Bulan</p>
              <p className="font-heading font-bold text-3xl text-[#38BDF8]">
                {isNaN(cicilan) || !isFinite(cicilan) ? '—' : formatRp(cicilan)}
              </p>
              <div className="flex justify-center gap-4 mt-3 text-[10px] text-[#94A3B8] font-sans">
                <span>DP: <strong className="text-white">{formatRp(dp)}</strong></span>
                <span>Pinjaman: <strong className="text-white">{formatRp(pokok)}</strong></span>
              </div>
              <p className="text-[10px] text-[#64748B] mt-1 font-sans">
                Total bayar: {formatRp(total)} selama {tenor} tahun
              </p>
            </div>

            <p className="text-[10px] text-slate-400 text-center font-sans mb-3">
              * Simulasi estimasi. Cicilan aktual tergantung kebijakan bank.
            </p>

            <Link
              href="/kalkulator/kpr"
              className="flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm py-3 rounded-xl transition-colors font-sans"
            >
              Simulasi Lengkap & Perbandingan Bank <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
