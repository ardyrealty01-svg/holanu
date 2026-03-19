'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, Tag, Percent, Toggle } from 'lucide-react';

const initialPackages = [
  { id: 'starter',  name: 'Starter',  price: 0,      yearly: 0,         listing: 3,   foto: 5,   featured: 0, kontrak: 0,  active: true,  highlight: false },
  { id: 'pro',      name: 'Pro',      price: 149000, yearly: 1490000,   listing: 25,  foto: 20,  featured: 1, kontrak: 5,  active: true,  highlight: false },
  { id: 'gold',     name: 'Gold',     price: 399000, yearly: 3990000,   listing: -1,  foto: -1,  featured: 5, kontrak: 10, active: true,  highlight: true  },
  { id: 'platinum', name: 'Platinum', price: -1,     yearly: -1,        listing: -1,  foto: -1,  featured: -1,kontrak: -1, active: true,  highlight: false },
];

const initialAddons = [
  { id: 'boost7',    name: 'Boost Listing 7 hari',     price: 25000,  active: true  },
  { id: 'boost30',   name: 'Boost Listing 30 hari',    price: 75000,  active: true  },
  { id: 'feat3',     name: 'Featured Homepage 3 hari', price: 50000,  active: true  },
  { id: 'feat7',     name: 'Featured Homepage 7 hari', price: 150000, active: true  },
  { id: 'refresh',   name: 'Refresh Listing',           price: 5000,   active: true  },
  { id: 'kontrak',   name: 'Tambah Kuota Kontrak',      price: 15000,  active: false },
];

const INIT_PROMOS = [
  { code: 'HOLANU50',  discount: '50%',     type: 'Persentase', product: 'Paket Pro',   used: 34, max: 100, active: true,  exp: '31/03/25' },
  { code: 'AGEN2025',  discount: 'Rp 75K',  type: 'Nominal',    product: 'Semua Paket', used: 89, max: 200, active: true,  exp: '30/04/25' },
  { code: 'FREEGOLD',  discount: '100%',    type: 'Persentase', product: 'Paket Gold',  used: 12, max: 20,  active: false, exp: '28/02/25' },
];

const fmt = (n: number) =>
  n < 0 ? 'Unlimited' : n === 0 ? 'Gratis' :
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function AdminPaketPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [addons,   setAddons]   = useState(initialAddons);
  const [promos,   setPromos]   = useState(INIT_PROMOS);
  const [tab,      setTab]      = useState<'paket' | 'addon' | 'promo'>('paket');
  const [saved,    setSaved]    = useState(false);

  const updatePkg = (id: string, field: string, value: unknown) =>
    setPackages(p => p.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Paket & Subscription</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            Perubahan harga langsung live — tidak perlu deploy ulang
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold font-sans transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
          }`}
        >
          <Save size={15} /> {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['paket', 'addon', 'promo'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all capitalize ${
              tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t === 'paket' ? 'Edit Paket' : t === 'addon' ? 'Add-ons' : 'Promo & Diskon'}
          </button>
        ))}
      </div>

      {tab === 'paket' && (
        <div className="space-y-4">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-bold text-[#1E3A8A] text-lg">{pkg.name}</h3>
                  {pkg.highlight && (
                    <span className="text-[9px] font-bold bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full">
                      Highlight Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-sans">Aktif</span>
                  <button
                    onClick={() => updatePkg(pkg.id, 'active', !pkg.active)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${pkg.active ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pkg.active ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Harga/bulan (Rp)', field: 'price',    value: pkg.price    },
                  { label: 'Harga/tahun (Rp)',  field: 'yearly',   value: pkg.yearly   },
                  { label: 'Maks Listing',       field: 'listing',  value: pkg.listing  },
                  { label: 'Maks Foto/listing',  field: 'foto',     value: pkg.foto     },
                  { label: 'Featured/bulan',     field: 'featured', value: pkg.featured },
                  { label: 'Kontrak Dok/bulan',  field: 'kontrak',  value: pkg.kontrak  },
                ].map(({ label, field, value }) => (
                  <div key={field}>
                    <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1 font-sans">{label}</label>
                    <input
                      type="number"
                      value={value < 0 ? '' : value}
                      placeholder={value < 0 ? '∞ (unlimited)' : ''}
                      onChange={e => updatePkg(pkg.id, field, e.target.value === '' ? -1 : parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                    />
                    <p className="text-[9px] text-[#1D4ED8] font-mono mt-0.5">{fmt(value)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-3">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkg.highlight}
                    onChange={e => updatePkg(pkg.id, 'highlight', e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#1D4ED8]"
                  />
                  Tampilkan sebagai "Recommended"
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'addon' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Daftar Add-ons</h2>
            <button
              onClick={() => alert('Fitur tambah add-on baru akan tersedia di versi berikutnya.')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans"
            >
              <Plus size={12} /> Tambah Add-on
            </button>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {addons.map(addon => (
              <div key={addon.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1E3A8A] font-sans">{addon.name}</p>
                  <p className="text-xs font-bold text-[#1D4ED8] mt-0.5">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(addon.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-sans">Rp</span>
                    <input
                      type="number"
                      value={addon.price}
                      onChange={e => setAddons(a => a.map(x => x.id === addon.id ? { ...x, price: parseInt(e.target.value) || 0 } : x))}
                      className="w-24 px-2.5 py-1.5 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-mono"
                    />
                  </div>
                  <button
                    onClick={() => setAddons(a => a.map(x => x.id === addon.id ? { ...x, active: !x.active } : x))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${addon.active ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${addon.active ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Hapus add-on "${addon.name}"?`)) setAddons(a => a.filter(x => x.id !== addon.id)); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'promo' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
            <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <Tag size={16} className="text-[#1D4ED8]" /> Buat Kode Promo Baru
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1 font-sans">Kode Promo</label>
                <input type="text" placeholder="HOLANU50" className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-mono uppercase" />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1 font-sans">Diskon</label>
                <div className="flex gap-1">
                  <input type="number" placeholder="50" className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                  <select className="border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] px-2 focus:outline-none bg-[#F8FAFF] font-sans">
                    <option>%</option>
                    <option>Rp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1 font-sans">Berlaku Untuk</label>
                <select className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                  <option>Semua Paket</option>
                  <option>Paket Pro</option>
                  <option>Paket Gold</option>
                  <option>Paket Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1 font-sans">Max Penggunaan</label>
                <input type="number" placeholder="100" className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
              </div>
            </div>
            <button
              onClick={() => alert('✅ Kode promo berhasil dibuat dan aktif! Bisa langsung digunakan oleh user.')}
              className="mt-3 flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors font-sans"
            >
              <Plus size={14} /> Buat Promo
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="font-heading font-semibold text-[#1E3A8A]">Promo Aktif & Riwayat</h2>
            </div>
            <table className="w-full">
              <thead className="bg-[#EFF6FF]">
                <tr>
                  {['Kode', 'Diskon', 'Untuk', 'Digunakan', 'Expired', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {promos.map(p => (
                  <tr key={p.code} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#1E3A8A]">{p.code}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-[#1D4ED8] font-bold">
                        <Percent size={10} /> {p.discount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-sans">{p.product}</td>
                    <td className="px-4 py-3 text-xs text-[#1E3A8A] font-bold">{p.used}/{p.max}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-sans">{p.exp}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${p.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                        {p.active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPromos(prev => prev.map(x => x.code === p.code ? { ...x, active: !x.active } : x))}
                        className={`text-[10px] font-bold hover:underline font-sans ${p.active ? 'text-red-500' : 'text-emerald-600'}`}
                      >
                        {p.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
