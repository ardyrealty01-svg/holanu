'use client';

import { useEffect, useState } from 'react';
import { ListingCard } from './listing-card';
import { getListings, listingToProperty } from '@/lib/api';
import { featuredProperties } from '@/lib/data';

export function FeaturedSection() {
  const [listings, setListings] = useState(featuredProperties);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getListings({ premium: true, limit: 6 })
      .then(res => {
        if (res.listings.length > 0) {
          setListings(res.listings.map(listingToProperty) as any);
        }
      })
      .catch(() => { /* fallback to static */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-[#1E3A8A]">Listing Premium</h2>
            <p className="text-sm text-slate-500 font-sans mt-0.5">Properti pilihan dari agen terpercaya</p>
          </div>
          <a href="/jual" className="text-sm font-semibold text-[#1D4ED8] hover:underline font-sans">
            Lihat Semua →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.slice(0, 6).map((p: any) => (
            <ListingCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
