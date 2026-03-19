'use client';
import { HOLANU_WA_NUMBER } from '@/lib/contact';

import { useState } from 'react';
import { Check, Crown, Zap, Building2, ChevronDown, CreditCard, Download } from 'lucide-react';

const packages = [
  {
    id: 'starter', name: 'Starter', price: 0, yearly: 0,
    features: ['3 listing aktif', '5 foto / listing', 'WhatsApp CTA', 'Statistik dasar'],
    limits: { listing: 3, foto: 5, featured: 0, kontrak: 0 },
    color: 'border-[#BFDBFE]', badge: '', current: false,
  },
  {
    id: 'pro', name: 'Pro', price: 149000, yearly: 1490000,
    features: ['25 listing aktif', '20 foto / listing', '1x Featured/bulan', 'Badge Terverifikasi', 'Analitik lengkap', '5 kontrak/bulan'],
    limits: { listing: 25, foto: 20, featured: 1, kontrak: 5 },
    color: 'border-[#1D4ED8]', badge: '', current: false,
  },
  {
    id: 'gold', name: 'Gold', price: 399000, yearly: 3990000,
    features: ['Unlimited listing', 'Unlimited foto', '5x Featured/bulan', 'Top placement area', 'Branding di listing', 'Analitik premium', '10 kontrak/bulan', 'Priority support'],
    limits: { listing: -1, foto: -1, featured: 5, kontrak: 10 },
    color: 'border-[#1D4ED8] border-2', badge: 'Aktif', current: true,
  },
  {
    id: 'platinum', name: 'Platinum', price: -1, yearly: -1,
    features: ['Semua fitur Gold', 'Multi-akun tim (3)', 'API bulk import', 'Dedicated manager', 'Kontrak unlimited'],
    limits: { listing: -1, foto: -1, featured: -1, kontrak: -1 },
    color: 'border-[#1a3a5c]', badge: 'Custom', current: false,
  },
];

const addons = [
  { label: 'Boost Listing 7 hari',     price: 'Rp 25.000' },
  { label: 'Boost Listing 30 hari',    price: 'Rp 75.000' },
  { label: 'Featured Homepage 3 hari', price: 'Rp 50.000' },
  { label: 'Featured Homepage 7 hari', price: 'Rp 150.000' },
  { label: 'Tambah Kuota Kontrak',     price: 'Rp 15.000' },
];

const invoices = [
  { date: '15 Mar 2025', desc: 'Paket Gold — 1 bulan', amount: 'Rp 399.000', status: 'Paid'    },
  { date: '15 Feb 2025', desc: 'Paket Gold — 1 bulan', amount: 'Rp 399.000', status: 'Paid'    },
  { date: '22 Jan 2025', desc: 'Boost Listing 7 hari', amount: 'Rp 25.000',  status: 'Paid'    },
  { date: '15 Jan 2025', desc: 'Paket Gold — 1 bulan', amount: 'Rp 399.000', status: 'Paid'    },
];

const fmt = (n: number) =>
  n < 0 ? '∞' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function LanggananPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [tab,     setTab]     = useState<'paket' | 'addon' | 'riwayat'>('paket');
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Langganan & Billing</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">Kelola paket dan pembayaran Anda</p>
      </div>

      {/* Active plan card */}
      <div className="bg-[#1E3A8A] rounded-xl border border-[rgba(186,230,253,0.2)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={18} className="text-[#1D4ED8]" />
              <span className="font-heading font-bold text-lg text-[#1D4ED8]">Paket Gold</span>
              <span className="text-[10px] bg-[#1D4ED8] text-white font-bold px-2 py-0.5 rounded-full">Aktif</span>
            </div>
            <p className="text-[#94A3B8] text-sm font-sans">Aktif sampai: <strong className="text-white">15 April 2025</strong> (23 hari lagi)</p>
            {/* Progress bar */}
            <div className="mt-3 space-y-1.5">
              {[
                { label: 'Listing Reguler', used: 12, max: 30 },
                { label: 'Listing Premium', used: 2,  max: 5  },
                { label: 'Featured/bulan',  used: 1,  max: 3  },
                { label: 'Kontrak Dok.',    used: 4,  max: 10 },
              ].map(({ label, used, max }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[10px] text-[#94A3B8] font-sans w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-[#1E40AF] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D4ED8] rounded-full"
                      style={{ width: `${(used/max) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#1D4ED8]">{used}/{max}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href={`https://wa.me/${HOLANU_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20memperpanjang%20paket%20aktif%20saya%20di%20HOLANU.`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.4)] px-4 py-2 rounded-lg hover:bg-[rgba(29,78,216,0.1)] transition-colors font-sans">
              Perpanjang
            </a>
            <a href={`https://wa.me/${HOLANU_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20upgrade%20ke%20Paket%20Platinum%20HOLANU.`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#1E3A8A] bg-[#1D4ED8] hover:bg-[#1E40AF] px-4 py-2 rounded-lg transition-colors font-sans">
              Upgrade Platinum
            </a>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['paket', 'addon', 'riwayat'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${
              tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t === 'paket' ? 'Pilih Paket' : t === 'addon' ? 'Beli Kuota' : 'Riwayat'}
          </button>
        ))}
      </div>

      {/* Packages tab */}
      {tab === 'paket' && (
        <>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`text-sm font-sans font-medium ${billing === 'monthly' ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>Bulanan</span>
            <button
              onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
              className={`w-11 h-6 rounded-full transition-colors relative ${billing === 'yearly' ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billing === 'yearly' ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
            </button>
            <span className={`text-sm font-sans font-medium ${billing === 'yearly' ? 'text-[#1E3A8A]' : 'text-slate-400'}`}>
              Tahunan <span className="text-[10px] bg-[#D1FAE5] text-[#065F46] px-1.5 py-0.5 rounded font-bold">Hemat 2 Bulan</span>
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map(pkg => (
              <div key={pkg.id} className={`bg-white rounded-xl border ${pkg.color} shadow-sm p-5 relative`}>
                {pkg.badge && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-bold bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <div className="mb-3">
                  <p className="font-heading font-bold text-[#1E3A8A] text-lg">{pkg.name}</p>
                  {pkg.price >= 0 ? (
                    <>
                      <p className="font-bold text-2xl text-[#1D4ED8] mt-1">
                        {billing === 'monthly' ? fmt(pkg.price) : fmt(Math.round(pkg.yearly / 12))}
                      </p>
                      <p className="text-[10px] text-slate-400 font-sans">/bulan {billing === 'yearly' && <span className="text-emerald-600 font-semibold">tagih tahunan</span>}</p>
                    </>
                  ) : (
                    <p className="font-bold text-2xl text-[#1D4ED8] mt-1">Custom</p>
                  )}
                </div>
                <ul className="space-y-1.5 mb-4">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                      <Check size={12} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {pkg.current ? (
                  <div className="text-center text-xs text-[#1D4ED8] font-bold font-sans py-2 bg-[#DBEAFE] rounded-lg">
                    Paket Aktif
                  </div>
                ) : pkg.price < 0 ? (
                  <a
                    href={`https://wa.me/${HOLANU_WA_NUMBER}?text=Halo%2C%20saya%20tertarik%20dengan%20paket%20Enterprise%20HOLANU.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-xs font-bold text-[#1E3A8A] bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-colors font-sans"
                  >
                    Hubungi Kami
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${HOLANU_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20${encodeURIComponent(pkg.price > 399000 ? 'upgrade' : 'berlangganan')}%20ke%20paket%20${encodeURIComponent(pkg.name)}%20HOLANU.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] py-2 rounded-lg transition-colors font-sans"
                  >
                    {pkg.price > 399000 ? 'Upgrade' : pkg.price > 0 ? 'Pilih Paket' : 'Gunakan Gratis'}
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add-ons tab */}
      {tab === 'addon' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
          <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Beli Kuota Individual</h2>
          <div className="space-y-3">
            {addons.map(({ label, price }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#1E3A8A] font-sans">{label}</p>
                  <p className="text-xs text-[#1D4ED8] font-bold">{price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#BFDBFE] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setAddonQty(q => ({ ...q, [label]: Math.max(1, (q[label] ?? 1) - 1) }))}
                      className="px-3 py-1.5 text-slate-500 hover:bg-[#EFF6FF] text-sm"
                    >−</button>
                    <span className="px-3 text-sm font-bold text-[#1E3A8A]">{addonQty[label] ?? 1}</span>
                    <button
                      onClick={() => setAddonQty(q => ({ ...q, [label]: (q[label] ?? 1) + 1 }))}
                      className="px-3 py-1.5 text-slate-500 hover:bg-[#EFF6FF] text-sm"
                    >+</button>
                  </div>
                  <a
                    href={`https://wa.me/${HOLANU_WA_NUMBER}?text=Halo%2C%20saya%20ingin%20beli%20${encodeURIComponent(label)}%20sebanyak%20${addonQty[label] ?? 1}%20unit%20di%20HOLANU.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors font-sans flex items-center gap-1.5"
                  >
                    <CreditCard size={12} /> Beli
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History tab */}
      {tab === 'riwayat' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Riwayat Transaksi</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#EFF6FF]">
              <tr>
                {['Tanggal', 'Deskripsi', 'Jumlah', 'Status', 'Invoice'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {invoices.map(({ date, desc, amount, status }) => (
                <tr key={date + desc} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500 font-sans">{date}</td>
                  <td className="px-5 py-3 text-xs text-[#1E3A8A] font-semibold font-sans">{desc}</td>
                  <td className="px-5 py-3 text-xs font-bold text-[#1D4ED8]">{amount}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">{status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => {
                        const content = `Invoice HOLANU\n\nTanggal: ${date}\nDeskripsi: ${desc}\nJumlah: ${amount}\nStatus: ${status}\n\nTerima kasih telah berlangganan HOLANU!`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url  = URL.createObjectURL(blob);
                        const a    = document.createElement('a');
                        a.href = url;
                        a.download = `invoice-holanu-${date.replace(/\//g,'-')}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-[#1D4ED8] transition-colors font-sans"
                    >
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
