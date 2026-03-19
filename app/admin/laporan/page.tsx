'use client';

import { Download, TrendingUp, Users, Home, DollarSign, BarChart2 } from 'lucide-react';

const monthlyData = [
  { month: 'Oct',  users: 189, listings: 234,  revenue: 7800000  },
  { month: 'Nov',  users: 210, listings: 312,  revenue: 9200000  },
  { month: 'Dec',  users: 198, listings: 289,  revenue: 8900000  },
  { month: 'Jan',  users: 245, listings: 401,  revenue: 10500000 },
  { month: 'Feb',  users: 312, listings: 523,  revenue: 11800000 },
  { month: 'Mar',  users: 234, listings: 891,  revenue: 12450000 },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
const maxListings = Math.max(...monthlyData.map(d => d.listings));

const topCities = [
  { city: 'Yogyakarta', listings: 1247, pct: 32, growth: '+18%' },
  { city: 'Semarang',   listings: 891,  pct: 23, growth: '+24%' },
  { city: 'Makassar',   listings: 743,  pct: 19, growth: '+31%' },
  { city: 'Medan',      listings: 654,  pct: 17, growth: '+12%' },
  { city: 'Surabaya',   listings: 356,  pct: 9,  growth: '+8%'  },
];

const reportTypes = [
  { icon: DollarSign, label: 'Revenue Report',     desc: 'Breakdown per produk, metode, periode' },
  { icon: Users,      label: 'User Report',         desc: 'Growth, churn, tier distribution'      },
  { icon: Home,       label: 'Listing Report',      desc: 'Velocity, conversion, top areas'       },
  { icon: TrendingUp, label: 'SEO Report',          desc: 'Impressions, clicks, top keywords'     },
  { icon: BarChart2,  label: 'Moderation Report',   desc: 'Reports, bans, response time'          },
  { icon: DollarSign, label: 'Payment Report',      desc: 'Success rate, failed, refund rate'     },
];

const fmt = (n: number) => {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return `Rp ${(n / 1000).toFixed(0)}K`;
};

export default function AdminLaporanPage() {
  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Laporan & Analytics</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Business intelligence HOLANU — Maret 2025</p>
        </div>
        <button onClick={() => alert("Export PDF laporan akan tersedia setelah integrasi payment selesai. Gunakan Export CSV di bawah untuk saat ini.")} className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-sm text-slate-600 px-4 py-2 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors">
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Users',      value: '+234',       sub: '↑18% MoM', color: 'text-emerald-600' },
          { label: 'New Listings',   value: '+891',       sub: '↑23% MoM', color: 'text-emerald-600' },
          { label: 'Revenue',        value: 'Rp 12,45jt', sub: '↑31% MoM', color: 'text-[#1D4ED8]'  },
          { label: 'Active Agents',  value: '289',        sub: '↑12% MoM', color: 'text-emerald-600' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#BFDBFE] p-4 shadow-sm">
            <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-400 font-sans">{label}</p>
            <p className="text-[10px] text-emerald-600 font-semibold font-sans">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">

        {/* Revenue + Listings chart (bar) */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
          <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Revenue 6 Bulan Terakhir</h2>
          <div className="flex items-end gap-2 h-36">
            {monthlyData.map(({ month, revenue, listings }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-28">
                  <div
                    className="flex-1 bg-[#1D4ED8] rounded-t-md transition-all hover:bg-[#1E40AF]"
                    style={{ height: `${(revenue / maxRevenue) * 100}%` }}
                    title={fmt(revenue)}
                  />
                  <div
                    className="flex-1 bg-[#BFDBFE] rounded-t-md transition-all hover:bg-[#D4C9A0]"
                    style={{ height: `${(listings / maxListings) * 100}%` }}
                    title={`${listings} listings`}
                  />
                </div>
                <span className="text-[9px] text-slate-400 font-sans">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#1D4ED8] rounded-sm" />
              <span className="text-[10px] text-slate-500 font-sans">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#BFDBFE] rounded-sm" />
              <span className="text-[10px] text-slate-500 font-sans">Listings</span>
            </div>
          </div>
        </div>

        {/* Top cities */}
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
          <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Top Kota by Listing</h2>
          <div className="space-y-3">
            {topCities.map(({ city, listings, pct, growth }) => (
              <div key={city}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#1E3A8A] font-sans font-medium">{city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E3A8A]">{listings.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{growth}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1D4ED8] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report download cards */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9]">
          <h2 className="font-heading font-semibold text-[#1E3A8A]">Download Laporan</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#F8FAFC]">
          {reportTypes.map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              onClick={() => {
                // Generate placeholder CSV and trigger download
                const csv = `Laporan ${label}\nDi-generate: ${new Date().toLocaleString('id-ID')}\n\nData akan tersedia setelah integrasi Midtrans dan sistem pelaporan selesai dikonfigurasi.`;
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement('a');
                a.href     = url;
                a.download = `holanu-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFF] transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#1D4ED8]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1E3A8A] font-heading">{label}</p>
                <p className="text-[10px] text-slate-400 font-sans">{desc}</p>
              </div>
              <Download size={13} className="text-slate-300 group-hover:text-[#1D4ED8] transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
