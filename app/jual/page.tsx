'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { getListings, listingToProperty, type ListingFilters } from '@/lib/api';
import { latestProperties, featuredProperties } from '@/lib/data';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const PROPERTY_TYPES = ['Semua', 'Rumah', 'Tanah', 'Apartemen', 'Villa', 'Ruko', 'Kost'];
const PROVINCES      = ['Semua Provinsi', 'DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Bali', 'Sulawesi Selatan'];
const PRICE_RANGES   = [
  { label: 'Semua Harga', min: undefined, max: undefined },
  { label: '< 300 Jt',    min: undefined, max: 300_000_000 },
  { label: '300 - 600 Jt',min: 300_000_000, max: 600_000_000 },
  { label: '600 Jt - 1 M',min: 600_000_000, max: 1_000_000_000 },
  { label: '1 M - 3 M',   min: 1_000_000_000, max: 3_000_000_000 },
  { label: '> 3 M',       min: 3_000_000_000, max: undefined },
];

const STATIC_LISTINGS = [
  ...featuredProperties,
  ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id)),
];

function JualPageInner() {
  const searchParams = useSearchParams();
  const cityParam     = searchParams.get('city') ?? '';
  const propTypeParam = searchParams.get('property_type') ?? '';
  const minPriceParam = searchParams.get('min_price') ?? '';
  const maxPriceParam = searchParams.get('max_price') ?? '';
  const provinsiParam = searchParams.get('provinsi') ?? '';

  const [listings,  setListings]  = useState<any[]>(STATIC_LISTINGS);
  const [total,     setTotal]     = useState(STATIC_LISTINGS.length);
  const [loading,   setLoading]   = useState(true);
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState('');
  const [propType,  setPropType]  = useState('Semua');
  const [province,  setProvince]  = useState('Semua Provinsi');
  const [cityFilter, setCityFilter] = useState('');
  const [priceIdx,  setPriceIdx]  = useState(0);

  // Sync ALL filter params from URL on first load (populated by FilterBar)
  useEffect(() => {
    if (cityParam)     { setCityFilter(cityParam); setSearch(cityParam); }
    if (propTypeParam) { setPropType(propTypeParam); }
    if (provinsiParam) { setProvince(provinsiParam); }
    // min/max price from URL → applied directly in load() via searchParams
  }, [cityParam, propTypeParam, provinsiParam]);

  const LIMIT = 12;

  const load = useCallback(async () => {
    setLoading(true);
    const price = PRICE_RANGES[priceIdx];
    // URL params (from FilterBar) take priority over local price selector
    const urlMinPrice = minPriceParam ? +minPriceParam : price.min;
    const urlMaxPrice = maxPriceParam ? +maxPriceParam : price.max;
    const filters: ListingFilters = {
      offer_type:    'Dijual',
      page,
      limit:         LIMIT,
      ...(search   ? { q: search } : {}),
      ...(propType !== 'Semua' ? { property_type: propType } : {}),
      ...(province !== 'Semua Provinsi' ? { province } : {}),
      ...(cityFilter ? { city: cityFilter } : {}),
      ...(urlMinPrice ? { min_price: urlMinPrice } : {}),
      ...(urlMaxPrice ? { max_price: urlMaxPrice } : {}),
    };

    try {
      const res = await getListings(filters);
      if (res.listings.length > 0) {
        setListings(res.listings.map(listingToProperty));
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
  }, [page, search, propType, province, priceIdx, cityFilter, minPriceParam, maxPriceParam]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, propType, province, priceIdx, cityFilter]);

  const totalPages = Math.ceil(total / LIMIT);
  const fmtNumber  = (n: number) => new Intl.NumberFormat('id-ID').format(n);

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

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-4 mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari lokasi, judul, kode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans placeholder-slate-300 text-[#1E3A8A]"
              />
            </div>
            <select
              value={propType}
              onChange={e => setPropType(e.target.value)}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans"
            >
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans"
            >
              {PROVINCES.map(p => <option key={p}>{p}</option>)}
            </select>
            <select
              value={priceIdx}
              onChange={e => setPriceIdx(Number(e.target.value))}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans"
            >
              {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
            </select>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setPropType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all font-sans ${
                  propType === t
                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                    : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
