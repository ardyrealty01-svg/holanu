'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import {
  Plus, Search, Grid3X3, List, Download, FileUp,
  Edit, Trash2, Eye, MessageSquare,
  MoreVertical, CheckCircle, Clock, AlertCircle, Loader2,
} from 'lucide-react';
import { getListings, listingToProperty, createListing } from '@/lib/api';

type Status = 'semua' | 'aktif' | 'pending' | 'negosiasi' | 'terjual' | 'draft';

const STATIC_LISTINGS = [
  { id: '0089', title: 'Rumah Modern Minimalis 3KT Cluster Condongcatur', price: 'Rp 850jt',    type: 'Rumah',    status: 'aktif',     views: 234, inquiry: 8,  days: 12 },
  { id: '0091', title: 'Kost Putri Eksklusif AC WiFi Dekat UGM',          price: 'Rp 1,5jt/bln',type: 'Kost',     status: 'aktif',     views: 380, inquiry: 5,  days: 8  },
  { id: '0094', title: 'Tanah Strategis SHM 300m² Dekat Tol Gamping',     price: 'Rp 600jt',   type: 'Tanah',    status: 'pending',   views: 12,  inquiry: 0,  days: 0  },
];

const pipeline = [
  { label: 'Draft',      count: 1,  color: 'bg-slate-300' },
  { label: 'Pending',    count: 1,  color: 'bg-amber-400' },
  { label: 'Aktif',      count: 2,  color: 'bg-emerald-400' },
  { label: 'Negosiasi',  count: 1,  color: 'bg-blue-400' },
  { label: 'Terjual',    count: 1,  color: 'bg-slate-500' },
];

const statusBadge: Record<string, { label: string; cls: string }> = {
  aktif:     { label: 'Aktif',     cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  pending:   { label: 'Pending',   cls: 'bg-amber-50  text-amber-700  border border-amber-200'  },
  negosiasi: { label: 'Negosiasi', cls: 'bg-blue-50   text-blue-700   border border-blue-200'   },
  terjual:   { label: 'Terjual',   cls: 'bg-slate-100 text-slate-600  border border-slate-200'  },
  draft:     { label: 'Draft',     cls: 'bg-gray-100  text-gray-500   border border-gray-200'   },
};

// ── CSV Template columns — match persis dengan D1 schema ──
const CSV_COLUMNS = [
  { key: 'title',          label: 'Judul Listing *',                   example: 'Rumah Modern 3KT SHM Condongcatur Sleman',  required: true  },
  { key: 'property_type',  label: 'Tipe Properti *',                   example: 'Rumah',                                    required: true  },
  { key: 'offer_type',     label: 'Penawaran *',                       example: 'Dijual',                                   required: true  },
  { key: 'price',          label: 'Harga (angka saja) *',              example: '850000000',                                required: true  },
  { key: 'original_price', label: 'Harga Sebelumnya (opsional)',       example: '950000000',                                required: false },
  { key: 'province',       label: 'Provinsi *',                        example: 'DI Yogyakarta',                            required: true  },
  { key: 'city',           label: 'Kab/Kota *',                        example: 'Sleman',                                   required: true  },
  { key: 'district',       label: 'Kecamatan',                         example: 'Depok',                                    required: false },
  { key: 'address',        label: 'Alamat Lengkap',                    example: 'Jl. Colombo No. 12 Condongcatur',          required: false },
  { key: 'land_area',      label: 'Luas Tanah m2',                     example: '120',                                      required: false },
  { key: 'building_area',  label: 'Luas Bangunan m2',                  example: '90',                                       required: false },
  { key: 'bedrooms',       label: 'Kamar Tidur',                       example: '3',                                        required: false },
  { key: 'bathrooms',      label: 'Kamar Mandi',                       example: '2',                                        required: false },
  { key: 'carports',       label: 'Garasi/Carport',                    example: '1',                                        required: false },
  { key: 'certificate',    label: 'Sertifikat',                        example: 'SHM',                                      required: false },
  { key: 'condition',      label: 'Kondisi',                           example: 'Baru',                                     required: false },
  { key: 'is_negotiable',  label: 'Bisa Nego (1=ya, 0=tidak)',         example: '1',                                        required: false },
  { key: 'description',    label: 'Deskripsi',                         example: 'Rumah modern siap huni lokasi strategis',  required: false },
  { key: 'sell_reason',    label: 'Alasan Jual/Sewa',                  example: 'Pindah tugas',                             required: false },
  { key: 'facilities',     label: 'Fasilitas (pisahkan dengan |)',      example: 'Garasi|Taman|Keamanan 24 Jam',             required: false },
  { key: 'video_url',      label: 'Link Video YouTube/TikTok',         example: 'https://youtube.com/watch?v=xxx',          required: false },
];

// Valid values untuk validasi
const VALID = {
  property_type: ['Rumah','Tanah','Kost','Hotel','Homestay','Villa','Ruko','Gudang','Lainnya'],
  offer_type:    ['Dijual','Disewa','Dijual & Disewa'],
  certificate:   ['SHM','HGB','SHGB','Girik','AJB','Lainnya'],
  condition:     ['Baru','Bekas','Renovasi'],
};

interface UploadResult {
  success:       number;
  errors:        number;
  errorMessages: string[];
}

function PropertiPage() {
  const searchParams  = useSearchParams();
  const { user }      = useUser();
  const { getToken }  = useAuth();
  const successCode   = searchParams.get('success');

  const [activeStatus, setActiveStatus] = useState<Status>('semua');
  const [viewMode,     setViewMode]     = useState<'list' | 'grid'>('list');
  const [search,       setSearch]       = useState('');
  const [allListings,  setAllListings]  = useState<any[]>(STATIC_LISTINGS);
  const [loading,      setLoading]      = useState(true);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploading,    setUploading]    = useState(false);

  // ── Download template CSV ──
  const downloadTemplate = () => {
    const headers = CSV_COLUMNS.map(c => c.label).join(',');
    const example = CSV_COLUMNS.map(c => `"${c.example}"`).join(',');
    const notes   = [
      '# PETUNJUK PENGISIAN:',
      `# property_type: ${VALID.property_type.join(' | ')}`,
      `# offer_type: ${VALID.offer_type.join(' | ')}`,
      `# certificate: ${VALID.certificate.join(' | ')}`,
      `# condition: ${VALID.condition.join(' | ')}`,
      '# Kolom bertanda * wajib diisi',
      '# Harga dalam Rupiah tanpa titik/koma (contoh: 850000000)',
      '# facilities: pisahkan dengan tanda | (pipe)',
    ].join('\n');

    const csv     = `${notes}\n${headers}\n${example}\n`;
    const blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = 'holanu-template-listing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Parse & upload CSV ──
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const token = await getToken();
    if (!token) { alert('Sesi login tidak valid, silakan login ulang'); return; }

    setUploading(true);
    setUploadResult(null);

    const text   = await file.text();
    const lines  = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    if (lines.length < 2) {
      setUploadResult({ success: 0, errors: 1, errorMessages: ['File CSV kosong atau tidak valid'] });
      setUploading(false);
      return;
    }

    // Parse header row — strip label suffix (setelah spasi pertama kalau ada *)
    const rawHeaders = lines[0].split(',').map(h =>
      h.trim().replace(/^"|"$/g, '').replace(/\s*\*.*$/, '').trim().toLowerCase()
    );

    // Map label → key
    const headerMap: Record<string, string> = {};
    CSV_COLUMNS.forEach(col => {
      const labelKey = col.label.replace(/\s*\*.*$/, '').trim().toLowerCase();
      const idx = rawHeaders.findIndex(h => h === col.key || h === labelKey);
      if (idx >= 0) headerMap[col.key] = String(idx);
    });

    const results: UploadResult = { success: 0, errors: 0, errorMessages: [] };

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row:  Record<string, string> = {};
      CSV_COLUMNS.forEach(col => {
        const idx = parseInt(headerMap[col.key] ?? '-1');
        row[col.key] = idx >= 0 ? (cols[idx] ?? '') : '';
      });

      // Validasi wajib
      const rowNum = i + 1;
      if (!row.title)         { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Judul wajib diisi`); continue; }
      if (!row.price || isNaN(+row.price)) { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Harga tidak valid`); continue; }
      if (!VALID.property_type.includes(row.property_type)) { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Tipe properti "${row.property_type}" tidak valid`); continue; }
      if (!VALID.offer_type.includes(row.offer_type))       { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Penawaran "${row.offer_type}" tidak valid`); continue; }
      if (!row.province)      { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Provinsi wajib diisi`); continue; }
      if (!row.city)          { results.errors++; results.errorMessages.push(`Baris ${rowNum}: Kota wajib diisi`); continue; }

      try {
        // user_id diambil dari JWT di backend — tidak dikirim dari frontend
        await createListing({
          title:          row.title,
          description:    row.description || null,
          sell_reason:    row.sell_reason || null,
          price:          +row.price,
          original_price: row.original_price ? +row.original_price : null,
          is_negotiable:  row.is_negotiable === '1' ? 1 : 0,
          province:       row.province,
          city:           row.city,
          district:       row.district || null,
          address:        row.address  || null,
          property_type:  row.property_type,
          offer_type:     row.offer_type,
          bedrooms:       row.bedrooms      ? +row.bedrooms      : 0,
          bathrooms:      row.bathrooms     ? +row.bathrooms     : 0,
          carports:       row.carports      ? +row.carports      : 0,
          land_area:      row.land_area     ? +row.land_area     : null,
          building_area:  row.building_area ? +row.building_area : null,
          certificate:    row.certificate || null,
          condition:      row.condition   || 'Baru',
          facilities:     row.facilities  ? row.facilities.split('|').map(f => f.trim()).filter(Boolean) : [],
          video_url:      row.video_url   || null,
          images:         [],
        }, token);
        results.success++;
      } catch (err: any) {
        results.errors++;
        results.errorMessages.push(`Baris ${rowNum}: ${err.message ?? 'Gagal upload'}`);
      }
    }

    setUploadResult(results);
    setUploading(false);
    if (results.success > 0) {
      // Refresh listing setelah upload berhasil
      getListings({ limit: 50 }).then(res => {
        if (res.listings.length > 0) setAllListings(res.listings.map(listingToProperty));
      }).catch(() => {});
    }
    // Reset input
    e.target.value = '';
  };

  // ── Hapus listing ──
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Hapus listing ini permanen? Tindakan tidak bisa dibatalkan.')) return;
    try {
      const token = await getToken();
      if (!token) { alert('Sesi login tidak valid'); return; }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllListings(prev => prev.filter((l: any) => l.id !== listingId));
    } catch { alert('Gagal hapus listing. Coba lagi.'); }
  };

  useEffect(() => {
    getListings({ limit: 50 })
      .then(res => {
        if (res.listings.length > 0) {
          const fmt = res.listings.map(l => ({
            id:      l.id,
            title:   l.title,
            price:   new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', maximumFractionDigits: 0 }).format(l.price),
            type:    l.property_type,
            status:  l.status,
            views:   l.views,
            inquiry: l.inquiry_count,
            days:    l.published_at ? Math.floor((Date.now() - new Date(l.published_at).getTime()) / 86400000) : 0,
          }));
          setAllListings(fmt);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const listings = allListings.filter(l => {
    if (activeStatus !== 'semua' && l.status !== activeStatus) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Success banner */}
      {successCode && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-sans">
            Listing <strong className="font-mono">{successCode}</strong> berhasil dikirim dan sedang dimoderasi. Akan aktif dalam 10 menit.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Properti Saya</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">{listings.length} listing terdaftar</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Download template CSV */}
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 border border-[#BFDBFE] text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors font-sans"
          >
            <Download size={15} /> Template CSV
          </button>
          {/* Mass upload */}
          <label className={`flex items-center gap-2 border text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors font-sans cursor-pointer ${
            uploading
              ? 'border-[#BFDBFE] text-[#1D4ED8] bg-[#EFF6FF] cursor-wait'
              : 'border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8] bg-white'
          }`}>
            {uploading
              ? <><Loader2 size={15} className="animate-spin" /> Mengupload...</>
              : <><FileUp size={15} /> Upload CSV</>
            }
            <input
              type="file"
              accept=".csv"
              className="hidden"
              disabled={uploading}
              onChange={handleCSVUpload}
            />
          </label>
          <Link
            href="/dashboard/properti/tambah"
            className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors font-sans"
          >
            <Plus size={16} /> Tambah Manual
          </Link>
        </div>
      </div>

      {/* CSV Upload result banner */}
      {uploadResult && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
          uploadResult.errors > 0
            ? 'bg-amber-50 border-amber-200'
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex-1">
            <p className={`text-sm font-semibold font-sans ${uploadResult.errors > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {uploadResult.success > 0
                ? `✅ ${uploadResult.success} listing berhasil diupload dan masuk antrian moderasi.`
                : '⚠️ Tidak ada listing yang berhasil diupload.'}
              {uploadResult.errors > 0 && ` ${uploadResult.errors} baris gagal.`}
            </p>
            {uploadResult.errorMessages.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {uploadResult.errorMessages.slice(0, 5).map((e, i) => (
                  <li key={i} className="text-xs text-amber-600 font-sans">• {e}</li>
                ))}
                {uploadResult.errorMessages.length > 5 && (
                  <li className="text-xs text-amber-500 font-sans">...dan {uploadResult.errorMessages.length - 5} error lainnya</li>
                )}
              </ul>
            )}
          </div>
          <button onClick={() => setUploadResult(null)} className="text-slate-400 hover:text-slate-600 flex-shrink-0">✕</button>
        </div>
      )}

      {/* Pipeline status bar */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] p-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          {pipeline.map(({ label, count, color }) => (
            <button
              key={label}
              onClick={() => setActiveStatus(label.toLowerCase() as Status)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ${
                activeStatus === label.toLowerCase()
                  ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                  : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${color}`} />
              {label}
              <span className="bg-slate-100 text-slate-600 px-1.5 rounded-full text-[10px]">{count}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveStatus('semua')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ml-auto ${
              activeStatus === 'semua'
                ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                : 'bg-white text-slate-600 border-[#BFDBFE]'
            }`}
          >
            Semua ({listings.length})
          </button>
        </div>
      </div>

      {/* CSV Info Banner */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <span className="text-lg flex-shrink-0">📋</span>
          <div>
            <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Upload Massal via CSV</p>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              Download template → isi data listing → upload. Semua listing akan masuk antrian moderasi otomatis.
              Kolom wajib: <span className="font-semibold text-[#1D4ED8]">title, property_type, offer_type, price, province, city</span>
            </p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[#1D4ED8] border border-[#BFDBFE] bg-white px-3 py-2 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans flex-shrink-0"
        >
          <Download size={12} /> Download Template
        </button>
      </div>

      {/* Search & view controls */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul atau kode listing..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-white font-sans text-[#1E3A8A] placeholder-slate-300"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => alert("Tampilan peta akan tersedia segera.")} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" title="Tampilan Peta">
            <Map size={16} />
          </button>
        </div>
        <button onClick={() => alert("Filter lanjutan: gunakan tab status di atas untuk filter berdasarkan status listing.")} className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-slate-600 text-sm px-3 py-2.5 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Listing rows */}
      <div className="space-y-3">
        {listings.map((listing: any) => {
          const badge = statusBadge[listing.status];
          return (
            <div key={listing.id} className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div
                  className="w-24 h-16 sm:w-32 sm:h-20 rounded-lg bg-[#1E40AF] flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ background: '#1E3A8A' }}
                >
                  <span className="text-[#1D4ED8] text-2xl">🏠</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">HOL-YGY-25-{listing.id}</span>
                        {listing.status === 'aktif' && (
                          <span className="text-[9px] text-slate-400 font-sans flex items-center gap-0.5">
                            <Clock size={9} /> {listing.days} hari lagi
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#1E3A8A] font-heading line-clamp-1">{listing.title}</p>
                      <p className="text-[#1D4ED8] font-bold text-sm mt-0.5">{listing.price}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={`/property/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                        title="Lihat listing"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => alert(`Edit listing: Fitur edit in-app akan segera tersedia.\n\nUntuk edit sekarang:\n1. Hapus listing ini\n2. Buat listing baru dengan data yang sudah diperbarui\n\nAtau hubungi support: wa.me/6281120000000`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit listing"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus listing"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Opsi lain">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Stats & feature toggles */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                      <Eye size={10} className="text-slate-400" /> {listing.views} views
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                      <MessageSquare size={10} className="text-slate-400" /> {listing.inquiry} inquiry
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                      <BarChart2 size={10} className="text-slate-400" />
                      <span>Score: {Math.min(95, 60 + listing.views / 10)}/100</span>
                    </div>
                    {listing.status === 'aktif' && (
                      <a href="/dashboard/langganan" className="flex items-center gap-1 text-[10px] text-[#1D4ED8] font-semibold font-sans border border-[rgba(29,78,216,0.3)] px-2 py-0.5 rounded-full hover:bg-[#DBEAFE] transition-colors ml-auto">
                        <TrendingUp size={10} /> Boost
                      </a>
                    )}
                    {listing.status === 'draft' && (
                      <button
                        onClick={async () => {
                          const token = await getToken();
                          if (!token) return;
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ status: 'aktif' }),
                          });
                          setAllListings(prev => prev.map((l: any) => l.id === listing.id ? { ...l, status: 'aktif' } : l));
                        }}
                        className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold font-sans border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-50 transition-colors ml-auto"
                      >
                        <CheckCircle size={10} /> Publish
                      </button>
                    )}
                    {listing.status === 'pending' && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 font-sans ml-auto">
                        <AlertCircle size={10} /> Menunggu review (auto 10 mnt)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-sans">
          <p className="text-3xl mb-3">🏠</p>
          <p className="font-semibold text-[#1E3A8A]">Tidak ada listing ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      )}
    </div>
  );
}

function PropertiPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-sans">Memuat...</div>}>
      <PropertiPage />
    </Suspense>
  );
}
