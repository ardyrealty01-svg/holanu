'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Download, TrendingUp, Users, Home, DollarSign, BarChart2, Loader2 } from 'lucide-react';

const monthlyData = [
  { month: 'Oct',  users: 189, listings: 234,  revenue: 7800000  },
  { month: 'Nov',  users: 210, listings: 312,  revenue: 9200000  },
  { month: 'Dec',  users: 198, listings: 289,  revenue: 8900000  },
  { month: 'Jan',  users: 245, listings: 401,  revenue: 10500000 },
  { month: 'Feb',  users: 312, listings: 523,  revenue: 11800000 },
  { month: 'Mar',  users: 234, listings: 891,  revenue: 12450000 },
];

const maxRevenue  = Math.max(...monthlyData.map(d => d.revenue));
const maxListings = Math.max(...monthlyData.map(d => d.listings));

const topCities = [
  { city: 'Yogyakarta', listings: 1247, pct: 32, growth: '+18%' },
  { city: 'Semarang',   listings: 891,  pct: 23, growth: '+24%' },
  { city: 'Makassar',   listings: 743,  pct: 19, growth: '+31%' },
  { city: 'Medan',      listings: 654,  pct: 17, growth: '+12%' },
  { city: 'Surabaya',   listings: 356,  pct: 9,  growth: '+8%'  },
];

const fmt = (n: number) => {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return `Rp ${(n / 1000).toFixed(0)}K`;
};

// ── Helper: trigger CSV download ──────────────────────────────────────────
function downloadCSV(filename: string, rows: string[][]) {
  const csv  = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminLaporanPage() {
  const { getToken }              = useAuth();
  const [downloading, setDl]      = useState<string | null>(null);

  // ── Download Listing Report — fetch real data from D1 ────────────────
  const handleDownloadListingReport = async () => {
    setDl('Listing Report');
    try {
      const token = await getToken();
      if (!token) { alert('Sesi tidak valid. Login ulang.'); return; }

      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/listings?limit=500`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json() as { ok: boolean; data: { listings: any[] } };

      if (!json.ok || !json.data?.listings?.length) {
        alert('Tidak ada data listing atau gagal fetch dari database.');
        return;
      }

      // Headers CSV — termasuk kolom gambar WebP
      const headers = [
        'Kode Listing', 'Judul', 'Tipe', 'Penawaran', 'Status',
        'Harga (Rp)', 'Harga Sewa (Rp)', 'Periode Sewa',
        'Provinsi', 'Kota', 'Kecamatan', 'Alamat',
        'Luas Tanah (m²)', 'Luas Bangunan (m²)', 'KT', 'KM', 'Garasi',
        'Sertifikat Tanah', 'IMB/PBG', 'Legalitas Usaha',
        'Kondisi', 'Fasilitas',
        'Foto 1 (WebP URL)', 'Foto 2 (WebP URL)', 'Foto 3 (WebP URL)',
        'Foto 4 (WebP URL)', 'Foto 5 (WebP URL)',
        'Total Foto', 'Views', 'Inquiry', 'Agent', 'Tgl Publish',
      ];

      const rows = json.data.listings.map((l: any) => {
        // Parse images JSON array dari D1
        let images: string[] = [];
        try { images = JSON.parse(l.images || '[]'); } catch { images = []; }

        // Parse legalitas_usaha
        let legalUsaha = '';
        try { legalUsaha = JSON.parse(l.legalitas_usaha || '[]').join('; '); } catch {}

        // Parse facilities
        let fasilitas = '';
        try { fasilitas = JSON.parse(l.facilities || '[]').join('; '); } catch {}

        return [
          l.code ?? l.id,
          l.title,
          l.property_type,
          l.offer_type,
          l.status,
          l.price ?? 0,
          l.sewa_price ?? '',
          l.rent_period ?? '',
          l.province ?? '',
          l.city ?? '',
          l.district ?? '',
          l.address ?? '',
          l.land_area ?? '',
          l.building_area ?? '',
          l.bedrooms ?? 0,
          l.bathrooms ?? 0,
          l.carports ?? 0,
          l.certificate ?? '',
          l.doc_status === 'on_hand' ? 'Ada' : l.doc_status === 'no_doc' ? 'Tidak Ada' : '',
          legalUsaha,
          l.condition ?? '',
          fasilitas,
          images[0] ?? '',  // Foto 1 — URL WebP dari ImageKit
          images[1] ?? '',  // Foto 2
          images[2] ?? '',  // Foto 3
          images[3] ?? '',  // Foto 4
          images[4] ?? '',  // Foto 5
          images.length,    // Total foto
          l.views ?? 0,
          l.inquiry_count ?? 0,
          l.agent_name ?? '',
          l.published_at ? l.published_at.split('T')[0] : '',
        ];
      });

      downloadCSV(
        `holanu-listing-report-${new Date().toISOString().split('T')[0]}.csv`,
        [headers, ...rows]
      );
    } catch (err) {
      alert('Gagal download laporan. Coba lagi.');
    } finally {
      setDl(null);
    }
  };

  // ── Download User Report ─────────────────────────────────────────────
  const handleDownloadUserReport = async () => {
    setDl('User Report');
    try {
      const token = await getToken();
      if (!token) return;
      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/users?limit=500`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json() as { ok: boolean; data: { users: any[] } };
      if (!json.ok || !json.data?.users?.length) { alert('Tidak ada data user.'); return; }

      const headers = ['ID', 'Nama', 'Email', 'WhatsApp', 'Kota', 'Provinsi', 'Role', 'Tier', 'Paket', 'Status', 'Tgl Daftar'];
      const rows    = json.data.users.map((u: any) => [
        u.id, u.name, u.email, u.whatsapp ?? '', u.city ?? '', u.province ?? '',
        u.role, u.tier ?? 1, u.paket ?? 'starter',
        u.is_banned ? 'Banned' : 'Aktif',
        u.created_at ? u.created_at.split('T')[0] : '',
      ]);

      downloadCSV(`holanu-user-report-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    } catch { alert('Gagal download.'); }
    finally  { setDl(null); }
  };

  const reportTypes = [
    {
      icon:  DollarSign,
      label: 'Revenue Report',
      desc:  'Breakdown per produk, metode, periode',
      onClick: () => { setDl('Revenue Report'); alert('Revenue Report tersedia setelah integrasi payment selesai.'); setDl(null); },
    },
    {
      icon:  Users,
      label: 'User Report',
      desc:  'Growth, churn, tier distribution',
      onClick: handleDownloadUserReport,
    },
    {
      icon:  Home,
      label: 'Listing Report',
      desc:  'Semua listing + URL foto WebP dari ImageKit',
      onClick: handleDownloadListingReport,
    },
    {
      icon:  TrendingUp,
      label: 'SEO Report',
      desc:  'Impressions, clicks, top keywords',
      onClick: () => { setDl('SEO Report'); alert('SEO Report akan tersedia setelah integrasi Google Search Console.'); setDl(null); },
    },
    {
      icon:  BarChart2,
      label: 'Moderation Report',
      desc:  'Reports, bans, response time',
      onClick: () => { setDl('Moderation Report'); alert('Moderation Report akan tersedia di versi berikutnya.'); setDl(null); },
    },
    {
      icon:  DollarSign,
      label: 'Payment Report',
      desc:  'Success rate, failed, refund rate',
      onClick: () => { setDl('Payment Report'); alert('Payment Report tersedia setelah integrasi Midtrans selesai.'); setDl(null); },
    },
  ];

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
          {reportTypes.map(({ icon: Icon, label, desc, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={downloading === label}
              className="flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFF] transition-colors text-left group disabled:opacity-60"
            >
              <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                {downloading === label
                  ? <Loader2 size={16} className="animate-spin text-[#1D4ED8]" />
                  : <Icon size={16} className="text-[#1D4ED8]" />
                }
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
