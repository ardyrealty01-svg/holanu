'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { getListings, listingToProperty } from '@/lib/api';
import { latestProperties } from '@/lib/data';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PROPERTY_TYPES = ['Semua', 'Rumah', 'Kost', 'Apartemen', 'Villa', 'Ruko'];
const PROVINCES      = ['Semua Provinsi', 'DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Bali'];

const STATIC = latestProperties.filter(p => p.offerType === 'Disewa');

function SewaPageInner() {
  const searchParams  = useSearchParams();
  const cityParam     = searchParams.get('city') ?? '';
  const propTypeParam = searchParams.get('property_type') ?? '';
  const minPriceParam = searchParams.get('min_price') ?? '';
  const maxPriceParam = searchParams.get('max_price') ?? '';
  const provinsiParam = searchParams.get('provinsi') ?? '';

  const [listings, setListings] = useState<any[]>(STATIC);
  const [total,    setTotal]    = useState(STATIC.length);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [propType, setPropType] = useState('Semua');
  const [province, setProvince] = useState('Semua Provinsi');
  const [cityFilter, setCityFilter] = useState('');

  // Sync FilterBar URL params on first load
  useEffect(() => {
    if (cityParam)     { setCityFilter(cityParam); setSearch(cityParam); }
    if (propTypeParam) { setPropType(propTypeParam); }
    if (provinsiParam) { setProvince(provinsiParam); }
  }, [cityParam, propTypeParam, provinsiParam]);

  const LIMIT = 12;

  const load = useCallback(async () => {
    setLoading(true);
    const urlMinPrice = minPriceParam ? +minPriceParam : undefined;
    const urlMaxPrice = maxPriceParam ? +maxPriceParam : undefined;
    try {
      const res = await getListings({
        offer_type: 'Disewa', page, limit: LIMIT,
        ...(search     ? { q: search } : {}),
        ...(cityFilter ? { city: cityFilter } : {}),
        ...(propType !== 'Semua' ? { property_type: propType } : {}),
        ...(province !== 'Semua Provinsi' ? { province } : {}),
        ...(urlMinPrice ? { min_price: urlMinPrice } : {}),
        ...(urlMaxPrice ? { max_price: urlMaxPrice } : {}),
      });
      if (res.listings.length > 0) {
        setListings(res.listings.map(listingToProperty));
        setTotal(res.total);
      } else if (page === 1) {
        setListings(STATIC); setTotal(STATIC.length);
      }
    } catch {
      if (page === 1) { setListings(STATIC); setTotal(STATIC.length); }
    } finally {
      setLoading(false);
    }
  }, [page, search, propType, province, cityFilter, minPriceParam, maxPriceParam]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, propType, province, cityFilter]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Properti Disewa</h1>
            <p className="text-[#93C5FD] text-sm font-sans">
              {loading ? 'Memuat...' : `${new Intl.NumberFormat('id-ID').format(total)} properti tersedia`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] p-4 mb-5 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari lokasi, judul..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans placeholder-slate-300 text-[#1E3A8A]"
              />
            </div>
            <select value={propType} onChange={e => setPropType(e.target.value)}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans">
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={province} onChange={e => setProvince(e.target.value)}
              className="px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#EFF6FF] font-sans">
              {PROVINCES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {PROPERTY_TYPES.map(t => (
              <button key={t} onClick={() => setPropType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all font-sans ${
                  propType === t ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                }`}>{t}</button>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((p: any) => <ListingCard key={p.id} property={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8]">
                <ChevronLeft size={16} className="text-[#1E3A8A]" />
              </button>
              <span className="text-sm font-sans text-slate-500">Hal {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8]">
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

export default function SewaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
        <div className="text-[#1D4ED8] font-sans text-sm">Memuat...</div>
      </div>
    }>
      <SewaPageInner />
    </Suspense>
  );
}
