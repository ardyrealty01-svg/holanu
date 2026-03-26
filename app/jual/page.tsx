'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { getListings, listingToProperty, type ListingFilters } from '@/lib/api';
import { latestProperties, featuredProperties } from '@/lib/data';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';

// ── Constants ─────────────────────────────────────────
const PROPERTY_TYPES = ['Semua', 'Rumah', 'Tanah', 'Apartemen', 'Villa', 'Ruko', 'Kost'];
const PROVINCES = ['Semua Provinsi', 'DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Bali', 'Sulawesi Selatan'];
const CERTIFICATES = ['Semua', 'SHM', 'HGB', 'SHGB', 'Girik'];
const CONDITIONS = ['Semua', 'Baru', 'Bekas', 'Renovasi'];
const SORT_OPTIONS = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Harga Terendah', value: 'price_asc' },
  { label: 'Harga Tertinggi', value: 'price_desc' },
  { label: 'Paling Banyak Dilihat', value: 'views' },
];

const STATIC_LISTINGS = [
  ...featuredProperties,
  ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id)),
];

function JualPageInner() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city') ?? '';
  const propTypeParam = searchParams.get('property_type') ?? '';
  const minPriceParam = searchParams.get('min_price') ?? '';
  const maxPriceParam = searchParams.get('max_price') ?? '';
  const provinsiParam = searchParams.get('provinsi') ?? '';

  // ── State ───────────────────────────────────────────
  const [listings, setListings] = useState<any[]>(STATIC_LISTINGS);
  const [total, setTotal] = useState(STATIC_LISTINGS.length);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [propType, setPropType] = useState('Semua');
  const [province, setProvince] = useState('Semua Provinsi');
  const [cityFilter, setCityFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [certificate, setCertificate] = useState('Semua');
  const [condition, setCondition] = useState('Semua');
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Sync URL params on first load ───────────────────
  useEffect(() => {
    if (cityParam) { setCityFilter(cityParam); setSearch(cityParam); }
    if (propTypeParam) setPropType(propTypeParam);
    if (provinsiParam) setProvince(provinsiParam);
    if (minPriceParam) setPriceMin(minPriceParam);
    if (maxPriceParam) setPriceMax(maxPriceParam);
  }, [cityParam, propTypeParam, provinsiParam, minPriceParam, maxPriceParam]);

  const LIMIT = 12;

  // ── Load listings ───────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const filters: ListingFilters = {
      offer_type: 'Dijual',
      page,
      limit: LIMIT,
      ...(search ? { q: search } : {}),
      ...(propType !== 'Semua' ? { property_type: propType } : {}),
      ...(province !== 'Semua Provinsi' ? { province } : {}),
      ...(cityFilter ? { city: cityFilter } : {}),
      ...(priceMin ? { min_price: +priceMin } : {}),
      ...(priceMax ? { max_price: +priceMax } : {}),
    };

    try {
      const res = await getListings(filters);
      if (res.listings.length > 0) {
        let mapped = res.listings.map(listingToProperty);

        // Client-side filter for certificate & condition
        if (certificate !== 'Semua') {
          mapped = mapped.filter(p => p.certificate === certificate);
        }
        if (condition !== 'Semua') {
          mapped = mapped.filter(p => p.condition === condition);
        }

        // Client-side sort
        if (sortBy === 'price_asc') mapped.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_desc') mapped.sort((a, b) => b.price - a.price);
        else if (sortBy === 'views') mapped.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

        setListings(mapped);
        setTotal(res.total);
      } else if (page === 1) {
        setListings(STATIC_LISTINGS.filter(p => p.offerType === 'Dijual'));
        setTotal(STATIC_LISTINGS.filter(p => p.offerType === 'Dijual').length);
      }
    } catch {
      if (page === 1) {
        setListings(STATIC_LISTINGS.filter(p => p.offerType === 'Dijual'));
        setTotal(STATIC_LISTINGS.filter(p => p.offerType === 'Dijual').length);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, propType, province, cityFilter, priceMin, priceMax, certificate, condition, sortBy]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, propType, province, priceMin, priceMax, certificate, condition, sortBy, cityFilter]);

  const totalPages = Math.ceil(total / LIMIT);
  const fmtNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  // ── Count active filters ────────────────────────────
  const activeFilterCount = [
    propType !== 'Semua',
    province !== 'Semua Provinsi',
    priceMin || priceMax,
    certificate !== 'Semua',
    condition !== 'Semua',
  ].filter(Boolean).length;

  // ── Reset filters ───────────────────────────────────
  const resetFilters = () => {
    setSearch('');
    setPropType('Semua');
    setProvince('Semua Provinsi');
    setCityFilter('');
    setPriceMin('');
    setPriceMax('');
    setCertificate('Semua');
    setCondition('Semua');
    setSortBy('newest');
  };

  // ── Format price for input display ──────────────────
  const formatPriceInput = (val: string) => {
    if (!val) return '';
    const n = Number(val.replace(/\D/g, ''));
    return n ? n.toLocaleString('id-ID') : '';
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Properti Dijual</h1>
            <p className="text-[#93C5FD] text-sm font-sans">
              {loading ? 'Memuat...' : `${fmtNumber(total)} properti tersedia`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ── Top bar: Search + Sort + Filter toggle ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari lokasi, judul, kode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-white font-sans placeholder-slate-300 text-[#1E3A8A]"
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-white font-sans"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] bg-white hover:border-[#1D4ED8] transition-colors font-sans"
            >
              <SlidersHorizontal size={14} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Layout: Sidebar + Grid ──────────────────── */}
          <div className="flex gap-6">
            {/* ═══ FILTER SIDEBAR ═══ */}
            <aside className={`
              ${sidebarOpen ? 'block' : 'hidden'} sm:block
              w-full sm:w-64 flex-shrink-0
              ${sidebarOpen ? 'fixed inset-0 z-50 bg-black/30 sm:relative sm:bg-transparent' : ''}
            `}>
              <div className={`
                ${sidebarOpen ? 'absolute right-0 top-0 h-full w-80 max-w-[90vw] overflow-y-auto' : ''}
                sm:relative sm:w-full sm:h-auto sm:max-w-none sm:overflow-visible
                bg-white sm:bg-transparent p-4 sm:p-0
              `}>
                {/* Mobile close */}
                {sidebarOpen && (
                  <div className="flex items-center justify-between mb-4 sm:hidden">
                    <span className="font-heading font-bold text-lg text-[#1E3A8A]">Filter</span>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                      <X size={20} className="text-slate-500" />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* ── Tipe Properti ────────────────── */}
                  <div className="bg-white rounded-xl border border-[#BFDBFE] p-4">
                    <h3 className="font-heading font-semibold text-sm text-[#1E3A8A] mb-3">Tipe Properti</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {PROPERTY_TYPES.map(t => (
                        <button
                          key={t}
                          onClick={() => setPropType(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all font-sans ${
                            propType === t
                              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                              : 'bg-[#EFF6FF] text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Harga ──────────────────────────── */}
                  <div className="bg-white rounded-xl border border-[#BFDBFE] p-4">
                    <h3 className="font-heading font-semibold text-sm text-[#1E3A8A] mb-3">Rentang Harga</h3>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 font-sans mb-1 block">Minimum (Rp)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={formatPriceInput(priceMin)}
                          onChange={e => setPriceMin(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-mono"
                        />
                      </div>
                      <span className="text-slate-300 self-end mb-2">—</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 font-sans mb-1 block">Maksimum (Rp)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Tak terbatas"
                          value={formatPriceInput(priceMax)}
                          onChange={e => setPriceMax(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-mono"
                        />
                      </div>
                    </div>
                    {/* Quick price presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        { label: '< 300 Jt', min: '', max: '300000000' },
                        { label: '300-600 Jt', min: '300000000', max: '600000000' },
                        { label: '600 Jt-1 M', min: '600000000', max: '1000000000' },
                        { label: '> 1 M', min: '1000000000', max: '' },
                      ].map(preset => (
                        <button
                          key={preset.label}
                          onClick={() => { setPriceMin(preset.min); setPriceMax(preset.max); }}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all font-sans ${
                            priceMin === preset.min && priceMax === preset.max
                              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                              : 'bg-[#EFF6FF] text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Provinsi ──────────────────────── */}
                  <div className="bg-white rounded-xl border border-[#BFDBFE] p-4">
                    <h3 className="font-heading font-semibold text-sm text-[#1E3A8A] mb-3">Provinsi</h3>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full px-3 py-2 border border-[#BFDBFE] rounded-lg text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans"
                    >
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* ── Sertifikat ────────────────────── */}
                  <div className="bg-white rounded-xl border border-[#BFDBFE] p-4">
                    <h3 className="font-heading font-semibold text-sm text-[#1E3A8A] mb-3">Sertifikat</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {CERTIFICATES.map(c => (
                        <button
                          key={c}
                          onClick={() => setCertificate(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all font-sans ${
                            certificate === c
                              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                              : 'bg-[#EFF6FF] text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Kondisi ──────────────────────── */}
                  <div className="bg-white rounded-xl border border-[#BFDBFE] p-4">
                    <h3 className="font-heading font-semibold text-sm text-[#1E3A8A] mb-3">Kondisi</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {CONDITIONS.map(c => (
                        <button
                          key={c}
                          onClick={() => setCondition(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all font-sans ${
                            condition === c
                              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                              : 'bg-[#EFF6FF] text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Reset button ─────────────────── */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#BFDBFE] rounded-xl text-xs text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors font-sans"
                    >
                      <RotateCcw size={12} />
                      Reset Semua Filter
                    </button>
                  )}

                  {/* Mobile apply button */}
                  {sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="w-full sm:hidden bg-[#1D4ED8] text-white font-bold px-4 py-3 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans text-sm"
                    >
                      Lihat Hasil ({total} properti)
                    </button>
                  )}
                </div>
              </div>
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="flex-1 min-w-0">
              {/* Active filter badges */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {propType !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[10px] font-semibold font-sans">
                      {propType}
                      <button onClick={() => setPropType('Semua')} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  )}
                  {province !== 'Semua Provinsi' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[10px] font-semibold font-sans">
                      {province}
                      <button onClick={() => setProvince('Semua Provinsi')} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  )}
                  {(priceMin || priceMax) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[10px] font-semibold font-sans">
                      {priceMin && priceMax ? `${(+priceMin/1e9).toFixed(0)}M — ${(+priceMax/1e9).toFixed(0)}M` : priceMin ? `> ${(+priceMin/1e9).toFixed(0)}M` : `< ${(+priceMax/1e9).toFixed(0)}M`}
                      <button onClick={() => { setPriceMin(''); setPriceMax(''); }} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  )}
                  {certificate !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[10px] font-semibold font-sans">
                      {certificate}
                      <button onClick={() => setCertificate('Semua')} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  )}
                  {condition !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-full text-[10px] font-semibold font-sans">
                      {condition}
                      <button onClick={() => setCondition('Semua')} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#BFDBFE] overflow-hidden animate-pulse">
                      <div className="h-44 bg-[#DBEAFE]" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-[#DBEAFE] rounded w-2/3" />
                        <div className="h-3 bg-[#EFF6FF] rounded w-full" />
                        <div className="h-3 bg-[#EFF6FF] rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-5xl mb-4">🔍</p>
                  <h2 className="font-heading font-bold text-xl text-[#1E3A8A] mb-2">Tidak ada listing</h2>
                  <p className="text-slate-500 font-sans text-sm">Coba ubah filter pencarian kamu</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 border border-[#BFDBFE] rounded-xl text-xs text-slate-500 hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors font-sans"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listings.map((p: any) => (
                    <ListingCard key={p.id} property={p} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8] transition-colors"
                  >
                    <ChevronLeft size={16} className="text-[#1E3A8A]" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold font-sans transition-all ${
                          p === page
                            ? 'bg-[#1D4ED8] text-white'
                            : 'border border-[#BFDBFE] text-[#1E3A8A] hover:border-[#1D4ED8]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8] transition-colors"
                  >
                    <ChevronRight size={16} className="text-[#1E3A8A]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function JualPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
        <div className="text-[#1D4ED8] font-sans text-sm">Memuat...</div>
      </div>
    }>
      <JualPageInner />
    </Suspense>
  );
}
