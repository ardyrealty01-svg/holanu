'use client';

import { useEffect, useState } from 'react';
import { ListingCard } from './listing-card';
import { getListings, listingToProperty } from '@/lib/api';
import { latestProperties } from '@/lib/data';

export function LatestSection() {
  const [listings, setListings] = useState(latestProperties);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getListings({ limit: 8 })
      .then(res => {
        if (res.listings.length > 0) {
          setListings(res.listings.map(listingToProperty) as any);
        }
      })
      .catch(() => { /* fallback to static */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 bg-[#EFF6FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-[#1E3A8A]">Listing Terbaru</h2>
            <p className="text-sm text-slate-500 font-sans mt-0.5">Properti baru ditambahkan hari ini</p>
          </div>
          <a href="/jual" className="text-sm font-semibold text-[#1D4ED8] hover:underline font-sans">
            Lihat Semua →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {listings.slice(0, 8).map((p: any) => (
            <ListingCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
