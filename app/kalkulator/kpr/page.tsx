'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const BANKS = [
  { name: 'BCA',    rate: 10.25 },
  { name: 'BRI',    rate: 10.50 },
  { name: 'BNI',    rate: 10.50 },
  { name: 'Mandiri',rate: 10.75 },
  { name: 'BTN',    rate: 9.75  },
];

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function KalkulatorKPRPage() {
  const [harga,  setHarga]  = useState(600000000);
  const [dpPct,  setDpPct]  = useState(20);
  const [tenor,  setTenor]  = useState(20);
  const [bunga,  setBunga]  = useState(10.5);

  const dp    = Math.round(harga * dpPct / 100);
  const pokok = harga - dp;

  const calc = (rate: number) => {
    const r = rate / 100 / 12;
    const n = tenor * 12;
    return Math.round((pokok * r) / (1 - Math.pow(1 + r, -n)));
  };

  const cicilan = calc(bunga);
  const total   = cicilan * tenor * 12;

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Kalkulator KPR</h1>
            <p className="text-slate-500 font-sans">Simulasikan cicilan & bandingkan berbagai bank</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Input */}
            <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 space-y-5">

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1E3A8A] font-sans">Harga Properti</label>
                  <span className="text-xs font-bold text-[#1D4ED8] font-mono">{formatRp(harga)}</span>
                </div>
                <input type="range" min={100000000} max={5000000000} step={50000000} value={harga} onChange={e => setHarga(+e.target.value)} className="w-full accent-[#1D4ED8]" />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>Rp 100 Jt</span><span>Rp 5 Miliar</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1E3A8A] font-sans">DP {dpPct}%</label>
                  <span className="text-xs font-bold text-[#1D4ED8] font-mono">{formatRp(dp)}</span>
                </div>
                <input type="range" min={10} max={50} step={5} value={dpPct} onChange={e => setDpPct(+e.target.value)} className="w-full accent-[#1D4ED8]" />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>10%</span><span>50%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Tenor</label>
                  <select value={tenor} onChange={e => setTenor(+e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                    {[5,10,15,20,25,30].map(t => <option key={t} value={t}>{t} tahun</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Suku Bunga</label>
                  <div className="relative">
                    <input type="number" step={0.1} min={5} max={20} value={bunga} onChange={e => setBunga(+e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-sans">%</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#1E3A8A] rounded-2xl p-4 text-center">
                <p className="text-xs text-[#94A3B8] font-sans mb-1">Estimasi Cicilan / Bulan</p>
                <p className="font-heading font-bold text-3xl text-[#1D4ED8]">{formatRp(cicilan)}</p>
                <div className="flex justify-center gap-6 mt-3 text-[10px] text-[#94A3B8] font-sans">
                  <div>DP<br/><strong className="text-white">{formatRp(dp)}</strong></div>
                  <div>Pinjaman<br/><strong className="text-white">{formatRp(pokok)}</strong></div>
                  <div>Total<br/><strong className="text-white">{formatRp(total)}</strong></div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center font-sans">
                * Simulasi estimasi. Cicilan aktual tergantung kebijakan bank yang dipilih.
              </p>
            </div>

            {/* Bank comparison */}
            <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6">
              <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Perbandingan Cicilan per Bank</h2>
              <div className="space-y-3">
                {BANKS.map(({ name, rate }) => {
                  const c = calc(rate);
                  const isMin = rate === Math.min(...BANKS.map(b => b.rate));
                  return (
                    <div key={name} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isMin ? 'bg-[#DBEAFE] border-[#1D4ED8]' : 'bg-[#EFF6FF] border-[#BFDBFE]'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-heading font-bold text-[#1E3A8A]">{name}</p>
                          {isMin && <span className="text-[9px] font-bold bg-[#1D4ED8] text-white px-1.5 py-0.5 rounded-full">Terendah</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans">Bunga {rate}% / tahun · Tenor {tenor} thn</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-heading font-bold text-lg ${isMin ? 'text-[#1D4ED8]' : 'text-[#1E3A8A]'}`}>{formatRp(c)}</p>
                        <p className="text-[9px] text-slate-400 font-sans">/ bulan</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 text-center font-sans mt-4">
                Rate berdasarkan suku bunga KPR terkini. Konfirmasi ke bank terkait untuk penawaran resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
