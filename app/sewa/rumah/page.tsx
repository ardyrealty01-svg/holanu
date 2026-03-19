'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { getListings, listingToProperty } from '@/lib/api';
import { latestProperties, featuredProperties } from '@/lib/data';

const PROP_TYPE = 'Rumah';
const STATIC = [...featuredProperties, ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id))]
  .filter(p => p.propertyType === PROP_TYPE && p.offerType === 'Disewa');

export default function SewaTypePage() {
  const [listings, setListings] = useState<any[]>(STATIC);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    getListings({ offer_type: 'Disewa', property_type: PROP_TYPE, limit: 12 })
      .then(res => {
        if (res.listings.length > 0) setListings(res.listings.map(listingToProperty));
        else setListings(STATIC);
      })
      .catch(() => setListings(STATIC))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">{PROP_TYPE} Disewa</h1>
            <p className="text-[#93C5FD] text-sm font-sans">{loading ? 'Memuat...' : `${listings.length} properti tersedia`}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#BFDBFE] overflow-hidden animate-pulse"><div className="h-44 bg-[#DBEAFE]" /><div className="p-4 space-y-2"><div className="h-4 bg-[#DBEAFE] rounded w-2/3" /></div></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((p: any) => <ListingCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
