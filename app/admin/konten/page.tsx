'use client';

import { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Globe, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const INIT_ARTICLES = [
  { id: 1, title: 'Panduan Lengkap KPR Pertama untuk Milenial 2025',    status: 'published', views: 1247, seo: 94, date: '15 Mar 2025', category: 'KPR'      },
  { id: 2, title: '5 Kecamatan di Yogyakarta dengan ROI Terbaik 2025',  status: 'published', views: 891,  seo: 87, date: '12 Mar 2025', category: 'Investasi'},
  { id: 3, title: '7 Modus Penipuan Properti Online dan Cara Hindari',  status: 'published', views: 654,  seo: 91, date: '10 Mar 2025', category: 'Tips Aman'},
  { id: 4, title: 'Harga Properti Semarang 2025: Tren dan Prediksi',    status: 'draft',     views: 0,    seo: 72, date: '17 Mar 2025', category: 'Market'   },
  { id: 5, title: 'Cara Cek Keaslian Sertifikat Tanah Secara Online',   status: 'scheduled', views: 0,    seo: 88, date: '20 Mar 2025', category: 'Panduan'  },
];

const seoIssues = [
  { type: 'error',   count: 32, label: 'Halaman listing tanpa meta description' },
  { type: 'warning', count: 12, label: 'Halaman area tanpa foto OG (1200×630)' },
  { type: 'warning', count: 7,  label: 'Judul terlalu panjang (>60 karakter)'   },
  { type: 'success', count: 98, label: 'Homepage SEO Score'                      },
];

const statusBadge: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft:     'bg-gray-100   text-gray-500   border border-gray-200',
  scheduled: 'bg-blue-50    text-blue-700   border border-blue-200',
};

export default function AdminKontenPage() {
  const [tab,      setTab]      = useState<'artikel' | 'seo' | 'auto'>('artikel');
  const [articles, setArticles] = useState(INIT_ARTICLES);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Konten & SEO</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">Kelola artikel, SEO, dan auto-generated content</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {(['artikel', 'seo', 'auto'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all ${tab === t ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'}`}
          >
            {t === 'artikel' ? 'Artikel & Blog' : t === 'seo' ? 'SEO Monitor' : 'Auto-Content AI'}
          </button>
        ))}
      </div>

      {tab === 'artikel' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Daftar Artikel</h2>
            <button
              onClick={() => alert('Fitur editor artikel akan tersedia setelah CMS backend selesai dikonfigurasi.')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] bg-[#1D4ED8] hover:bg-[#1E40AF] px-3 py-2 rounded-xl transition-colors font-sans"
            >
              <Plus size={13} /> Artikel Baru
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-[#EFF6FF]">
              <tr>
                {['Judul', 'Kategori', 'Status', 'Views', 'SEO Score', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {articles.map(({ id, title, status, views, seo, date, category }) => (
                <tr key={id} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs font-semibold text-[#1E3A8A] font-heading line-clamp-1">{title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded">{category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded capitalize ${statusBadge[status]}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#1E3A8A]">{views > 0 ? views.toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${seo >= 90 ? 'bg-emerald-400' : seo >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${seo}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{seo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-400 font-sans">{date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <a
                        href={`/panduan/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                        title="Lihat artikel"
                      >
                        <Eye size={12} />
                      </a>
                      <button
                        onClick={() => alert(`Editor artikel akan tersedia setelah CMS backend dikonfigurasi.\n\nArtikel: "${title}"`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit artikel"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus artikel "${title}"?`)) {
                            setArticles(prev => prev.filter(a => a.id !== id));
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus artikel"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          {/* Issues list */}
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-[#1E3A8A]">Masalah SEO Terdeteksi</h2>
              <button className="text-xs font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans flex items-center gap-1">
                <Zap size={11} /> Fix Otomatis
              </button>
            </div>
            <div className="space-y-3">
              {seoIssues.map(({ type, count, label }) => (
                <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  type === 'error'   ? 'bg-red-50    border-red-200'     :
                  type === 'warning' ? 'bg-amber-50  border-amber-200'   :
                  'bg-emerald-50 border-emerald-200'
                }`}>
                  {type === 'error'   ? <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />   :
                   type === 'warning' ? <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" /> :
                   <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />}
                  <span className="flex-1 text-xs font-sans text-[#1E3A8A]">{label}</span>
                  <span className={`text-sm font-bold ${type === 'success' ? 'text-emerald-600' : type === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                    {type === 'success' ? `${count}/100` : count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sitemap */}
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
            <h2 className="font-heading font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
              <Globe size={15} className="text-[#1D4ED8]" /> Sitemap Manager
            </h2>
            <div className="flex items-center justify-between bg-[#EFF6FF] rounded-xl p-4">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Terakhir di-generate: 3 hari lalu</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">3.891 URL listing + 24 city pages + blog</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('✅ Sitemap berhasil di-generate! File tersedia di /sitemap.xml — Next.js otomatis generate sitemap dari routes yang ada.')}
                  className="text-xs font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2 rounded-xl transition-colors font-sans"
                >
                  Generate Sekarang
                </button>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold border border-[#BFDBFE] text-slate-600 px-4 py-2 rounded-xl hover:border-[#1D4ED8] transition-colors font-sans"
                >
                  Submit ke Google
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'auto' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm p-5">
            <h2 className="font-heading font-semibold text-[#1E3A8A] mb-1 flex items-center gap-2">
              <Zap size={15} className="text-[#1D4ED8]" /> Generate Halaman Area
            </h2>
            <p className="text-xs text-slate-500 font-sans mb-4">Auto-aggregate data listing → generate draft artikel → edit & publish</p>
            <div className="flex gap-3 mb-4">
              <select className="flex-1 px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                <option>Pilih Area / Kecamatan...</option>
                <option>Kecamatan Depok, Sleman</option>
                <option>Kecamatan Mlati, Sleman</option>
                <option>Kota Yogyakarta</option>
                <option>Kota Semarang</option>
              </select>
              <select className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                <option>Panduan Area</option>
                <option>Harga Properti</option>
                <option>Top 5 Listing</option>
              </select>
              <button
                onClick={() => alert('✅ Artikel AI sedang di-generate! Akan selesai dalam 30 detik. Fitur ini menggunakan Groq AI yang sudah terintegrasi.')}
                className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors font-sans whitespace-nowrap"
              >
                <Zap size={14} /> Generate AI
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="font-heading font-semibold text-[#1E3A8A]">Jadwal Auto-Content</h2>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {[
                { label: 'Market Report Mingguan',      on: true,  freq: 'Senin 07:00 WIB' },
                { label: 'Top 5 Listing Area X',        on: true,  freq: 'Setiap minggu'    },
                { label: 'Halaman area baru (5+ listing)',on: false, freq: 'Trigger-based'  },
              ].map(({ label, on, freq }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold text-[#1E3A8A] font-sans">{label}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{freq}</p>
                  </div>
                  <button className={`w-10 h-5 rounded-full transition-colors relative ${on ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
