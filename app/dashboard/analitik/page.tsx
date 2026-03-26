'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  TrendingUp, Eye, MessageSquare, MousePointerClick,
  Clock, MapPin, Loader2, ChevronDown,
} from 'lucide-react';
import { getListings, listingToProperty } from '@/lib/api';

const topListings = [
  { rank: '🥇', title: 'Rumah Condongcatur',      code: 'HOL-0089', views: 450, inquiry: 12, conv: '2.7%' },
  { rank: '🥈', title: 'Kost Putri Dekat UGM',   code: 'HOL-0091', views: 380, inquiry: 8,  conv: '2.1%' },
  { rank: '🥉', title: 'Tanah Strategis Gamping', code: 'HOL-0094', views: 290, inquiry: 5,  conv: '1.7%' },
  { rank: '4',  title: 'Villa Pakem Pool',         code: 'HOL-0102', views: 890, inquiry: 14, conv: '1.6%' },
  { rank: '5',  title: 'Ruko Mlati 3 Lantai',     code: 'HOL-0058', views: 450, inquiry: 22, conv: '4.9%' },
];

const sources = [
  { name: 'Langsung / Direct', pct: 40, color: 'bg-[#1D4ED8]' },
  { name: 'Google Search',     pct: 35, color: 'bg-[#1E3A8A]' },
  { name: 'Media Sosial',      pct: 20, color: 'bg-blue-400'  },
  { name: 'WhatsApp Share',    pct: 5,  color: 'bg-emerald-400'},
];

const heatmap = [
  { day: 'Sen', hours: [1,1,1,0,0,0,0,1,2,2,2,2,2,2,1,1,1,1,2,3,3,3,2,1] },
  { day: 'Sel', hours: [0,0,0,0,0,0,0,1,2,2,2,2,2,1,1,1,1,2,2,3,3,2,2,1] },
  { day: 'Rab', hours: [0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,1,1,2,3,3,3,2,1] },
  { day: 'Kam', hours: [0,0,0,0,0,0,0,1,1,2,2,2,2,1,1,1,1,2,2,3,3,2,1,0] },
  { day: "Jum", hours: [0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,1,1,2,2,3,4,4,3,2] },
  { day: 'Sab', hours: [1,0,0,0,0,0,1,1,2,3,3,3,3,3,2,2,2,2,3,4,4,4,3,2] },
  { day: 'Min', hours: [1,1,0,0,0,0,1,2,3,3,3,3,3,3,2,2,2,2,3,4,4,4,3,2] },
];

const heatColor = (v: number) => {
  if (v === 0) return 'bg-[#F1F5F9]';
  if (v === 1) return 'bg-[#DBEAFE]';
  if (v === 2) return 'bg-[#93C5FD]';
  if (v === 3) return 'bg-[#1D4ED8]';
  return 'bg-[#1E3A8A]';
};

export default function AnalitikPage() {
  const { user, isLoaded }       = useUser();
  const [listings,   setListings]  = useState<any[]>([]);
  const [loading,    setLoading]   = useState(true);
  const [dateRange,  setDateRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    if (!isLoaded) return;
    // Filter berdasarkan user_id agar hanya tampil listing milik agen ini
    getListings({ user_id: user?.id, limit: 50 })
      .then(res => {
        if (res.listings.length > 0) setListings(res.listings.map(listingToProperty));
        else setListings(topListings.map(l => ({ ...l, id: l.code, title: l.title, views: l.views, inquiry_count: l.inquiry })));
      })
      .catch(() => setListings(topListings.map(l => ({ ...l, id: l.code, title: l.title, views: l.views, inquiry_count: l.inquiry }))))
      .finally(() => setLoading(false));
  }, [isLoaded, user?.id]);

  const totalViews    = listings.reduce((s, l) => s + (l.views ?? 0), 0);
  const totalInquiry  = listings.reduce((s, l) => s + (l.inquiry_count ?? 0), 0);
  const convRate      = totalViews > 0 ? ((totalInquiry / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Analitik</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Performa listing kamu</p>
        </div>
        <button
          onClick={() => setDateRange(r => r === 30 ? 7 : r === 7 ? 90 : 30)}
          className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-sm text-[#1E3A8A] px-3 py-2 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors"
        >
          {dateRange} Hari <ChevronDown size={14} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye,               label: 'Total Views',    value: loading ? '…' : totalViews.toLocaleString('id-ID'),  sub: 'kumulatif semua listing', up: true  },
          { icon: MessageSquare,     label: 'Total Inquiry',  value: loading ? '…' : totalInquiry.toString(),             sub: 'dari semua listing',      up: true  },
          { icon: MousePointerClick, label: 'Conversion Rate',value: loading ? '…' : `${convRate}%`,                     sub: 'views → inquiry',         up: parseFloat(convRate) > 0 },
          { icon: Clock,             label: 'Listing Aktif',  value: loading ? '…' : listings.length.toString(),         sub: 'properti tayang',         up: listings.length > 0 },
        ].map(({ icon: Icon, label, value, sub, up }) => (
          <div key={label} className="bg-white rounded-xl border border-[#BFDBFE] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Icon size={16} className="text-[#1D4ED8]" />
              {loading && <Loader2 size={13} className="text-slate-300 animate-spin" />}
            </div>
            <p className="font-heading font-bold text-2xl text-[#1E3A8A]">{value}</p>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">{label}</p>
            <p className="text-[10px] text-slate-400 font-sans">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        {/* Top Listings Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Ranking Performa Listing</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#EFF6FF]">
                  <th className="text-left px-5 py-2.5 text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">#</th>
                  <th className="text-left px-3 py-2.5 text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Listing</th>
                  <th className="text-right px-3 py-2.5 text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Views</th>
                  <th className="text-right px-3 py-2.5 text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Inquiry</th>
                  <th className="text-right px-5 py-2.5 text-[10px] text-slate-400 font-semibold font-sans uppercase tracking-wider">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-sans text-sm">
                    <Loader2 size={16} className="animate-spin inline mr-2" />Memuat data...
                  </td></tr>
                ) : listings.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-sans text-sm">
                    Belum ada listing aktif
                  </td></tr>
                ) : (
                  listings
                    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
                    .slice(0, 8)
                    .map((row, i) => {
                      const conv = row.views > 0 ? ((row.inquiry_count / row.views) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={row.id} className="hover:bg-[#F8FAFF] transition-colors">
                          <td className="px-5 py-3 text-sm font-bold text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3">
                            <p className="text-xs font-semibold text-[#1E3A8A] font-heading line-clamp-1">{row.title}</p>
                            <p className="font-mono text-[9px] text-slate-400">{row.code ?? row.id}</p>
                          </td>
                          <td className="px-3 py-3 text-right text-xs font-bold text-[#1E3A8A]">{(row.views ?? 0).toLocaleString('id-ID')}</td>
                          <td className="px-3 py-3 text-right text-xs font-bold text-[#1D4ED8]">{row.inquiry_count ?? 0}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{conv}%</span>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
          <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Sumber Traffic</h2>
          <div className="space-y-3">
            {sources.map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#1E3A8A] font-sans">{name}</span>
                  <span className="text-xs font-bold text-[#1E3A8A]">{pct}%</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
            <p className="text-[10px] text-slate-400 font-sans mb-2">Pengunjung dari kota:</p>
            {[['Yogyakarta', '62%'], ['Sleman', '18%'], ['Jakarta', '12%'], ['Lainnya', '8%']].map(([city, pct]) => (
              <div key={city} className="flex items-center gap-2 mb-1">
                <MapPin size={10} className="text-[#1D4ED8]" />
                <span className="text-[10px] text-[#1E3A8A] font-sans flex-1">{city}</span>
                <span className="text-[10px] font-bold text-slate-500">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Time Heatmap */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-heading font-semibold text-[#1E3A8A]">Waktu Terbaik untuk Boost</h2>
        </div>
        <p className="text-xs text-slate-500 font-sans mb-4">
          💡 Listing kamu paling banyak dilihat <strong>Sabtu–Minggu, pukul 19.00–22.00</strong>
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex items-center gap-0.5 mb-1 pl-8">
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="flex-1 text-center text-[8px] text-slate-400 font-mono">
                  {h % 6 === 0 ? `${h}` : ''}
                </div>
              ))}
            </div>
            {heatmap.map(({ day, hours }) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <span className="w-8 text-[9px] text-slate-400 font-sans text-right pr-2 flex-shrink-0">{day}</span>
                {hours.map((v, h) => (
                  <div
                    key={h}
                    className={`flex-1 h-5 rounded-sm ${heatColor(v)} transition-all`}
                    title={`${day} ${h}:00 — level ${v}`}
                  />
                ))}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-[9px] text-slate-400 font-sans">Rendah</span>
              {['bg-[#F1F5F9]', 'bg-[#DBEAFE]', 'bg-[#93C5FD]', 'bg-[#1D4ED8]', 'bg-[#1E3A8A]'].map(c => (
                <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
              ))}
              <span className="text-[9px] text-slate-400 font-sans">Tinggi</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
