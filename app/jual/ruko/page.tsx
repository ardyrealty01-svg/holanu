'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { getListings, listingToProperty } from '@/lib/api';
import { latestProperties, featuredProperties } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TYPE_MAP: Record<string, string> = {
  rumah: 'Rumah', apartemen: 'Apartemen', tanah: 'Tanah', ruko: 'Ruko',
};
const SLUG = 'ruko';
const PROP_TYPE = TYPE_MAP[SLUG] ?? 'Rumah';
const STATIC = [...featuredProperties, ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id))]
  .filter(p => p.propertyType === PROP_TYPE);

export default function JualTypePage() {
  const [listings, setListings] = useState<any[]>(STATIC);
  const [total,    setTotal]    = useState(STATIC.length);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    setLoading(true);
    getListings({ offer_type: 'Dijual', property_type: PROP_TYPE, page, limit: LIMIT })
      .then(res => {
        if (res.listings.length > 0) { setListings(res.listings.map(listingToProperty)); setTotal(res.total); }
        else if (page === 1) { setListings(STATIC); setTotal(STATIC.length); }
      })
      .catch(() => { if (page === 1) { setListings(STATIC); setTotal(STATIC.length); } })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">{PROP_TYPE} Dijual</h1>
            <p className="text-[#93C5FD] text-sm font-sans">
              {loading ? 'Memuat...' : `${new Intl.NumberFormat('id-ID').format(total)} properti tersedia`}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#BFDBFE] overflow-hidden animate-pulse">
                  <div className="h-44 bg-[#DBEAFE]" /><div className="p-4 space-y-2"><div className="h-4 bg-[#DBEAFE] rounded w-2/3" /><div className="h-3 bg-[#EFF6FF] rounded w-full" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((p: any) => <ListingCard key={p.id} property={p} />)}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8]"><ChevronLeft size={16} className="text-[#1E3A8A]" /></button>
              <span className="text-sm font-sans text-slate-500">Hal {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-[#BFDBFE] disabled:opacity-40 hover:border-[#1D4ED8]"><ChevronRight size={16} className="text-[#1E3A8A]" /></button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
