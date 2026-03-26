'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ListingCard } from '@/components/listing-card';
import { getFavorites, type Listing } from '@/lib/api';
import { latestProperties, featuredProperties } from '@/lib/data';
import { Heart, Loader2, Trash2 } from 'lucide-react';

export default function TersimpanPage() {
  const { getToken } = useAuth();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('Sesi login tidak valid');
        setLoading(false);
        return;
      }
      const res = await getFavorites(token);
      setFavorites(res.favorites ?? []);
    } catch {
      setError('Gagal memuat properti tersimpan');
      // Fallback: show nothing for favorites page
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // ── Remove from list after unfavorite from card ──
  const handleRemove = (listingId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== listingId));
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] flex items-center gap-2">
          <Heart size={24} className="text-red-500 fill-red-500" />
          Properti Tersimpan
        </h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">
          {loading ? 'Memuat...' : `${favorites.length} properti tersimpan`}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-center justify-between">
          <p className="text-sm text-amber-800">{error}</p>
          <button
            onClick={loadFavorites}
            className="ml-4 px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-12 justify-center">
          <Loader2 size={20} className="animate-spin text-[#1D4ED8]" />
          <span className="text-sm font-sans">Memuat properti tersimpan...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && favorites.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#BFDBFE] py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-[#1D4ED8]" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1E3A8A] mb-2">
            Belum Ada Properti Tersimpan
          </h3>
          <p className="text-sm text-slate-500 font-sans max-w-md mx-auto mb-6">
            Klik ikon ❤️ pada properti yang menarik untuk menyimpannya di sini. 
            Anda bisa kembali dan melihatnya kapan saja.
          </p>
          <a
            href="/jual"
            className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans text-sm"
          >
            Jelajahi Properti
          </a>
        </div>
      )}

      {/* Grid of saved listings */}
      {!loading && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((listing) => (
            <div key={listing.id} className="relative group">
              <ListingCard 
                property={{
                  id: listing.id,
                  title: listing.title,
                  location: [listing.district, listing.city].filter(Boolean).join(', ') || listing.city || 'Indonesia',
                  price: listing.price,
                  area: listing.land_area ?? listing.building_area ?? 0,
                  image: (() => { try { return JSON.parse(listing.images || '[]')[0] ?? '/images/listing-1.jpg'; } catch { return '/images/listing-1.jpg'; } })(),
                  propertyType: listing.property_type as any,
                  offerType: listing.offer_type as any,
                  bedrooms: listing.bedrooms,
                  bathrooms: listing.bathrooms,
                  certificate: listing.certificate as any,
                  agentName: undefined,
                  agentVerified: false,
                  views: listing.views,
                  isPremium: listing.is_premium === 1,
                  isFeatured: listing.is_featured === 1,
                }}
                initialFavorited={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
