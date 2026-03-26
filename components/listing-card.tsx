'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Heart, ChevronLeft, ChevronRight, Camera,
  MapPin, BedDouble, Bath, Building2, Eye, ShieldCheck, Star,
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { Property, isHot, savingsPercent } from '@/lib/data';
import { addFavorite, removeFavorite } from '@/lib/api';

interface ListingCardProps {
  property: Property;
  initialFavorited?: boolean;
}

// ─── Diamond SVG icon for FEATURED badge ───
function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M6 3h12l4 6-10 13L2 9z" fill="#93C5FD" />
    </svg>
  );
}

// ─── Offer badge colour mapping ───
const offerStyle: Record<string, string> = {
  'Dijual':          'bg-[rgba(13,27,42,0.72)] text-[#1D4ED8]',
  'Disewa':          'bg-[rgba(37,87,163,0.80)] text-[#e0f0ff]',
  'Dijual & Disewa': 'bg-[rgba(13,27,42,0.72)] text-[#93C5FD]',
};

// ─── Certificate badge colour mapping ───
const certStyle: Record<string, string> = {
  SHM:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  HGB:  'bg-blue-50   text-blue-700   border border-blue-200',
  SHGB: 'bg-blue-50   text-blue-700   border border-blue-200',
  Girik:'bg-amber-50  text-amber-700  border border-amber-200',
};

export function ListingCard({ property, initialFavorited = false }: ListingCardProps) {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [saving, setSaving] = useState(false);

  // Support multiple images when available; fall back to single image
  const images: string[] = (property as any).images?.length
    ? (property as any).images
    : [property.image].filter(Boolean);
  const totalImages = images.length;
  const hot         = isHot(property);
  const savings     = savingsPercent(property);

  // ─── Price formatter ───
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);

  // maximumFractionDigits:0 prevents SSR/client hydration mismatch
  // ("Rp 950,0 jt" on some locales vs "Rp 950 jt" on others)
  const formatCompact = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(price);

  // ─── Image navigation ───
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(i => (i > 0 ? i - 1 : images.length - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentImageIndex(i => (i < images.length - 1 ? i + 1 : 0));
  };
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isSignedIn || saving) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      if (isFavorited) {
        await removeFavorite(property.id, token);
        setIsFavorited(false);
      } else {
        await addFavorite(property.id, token);
        setIsFavorited(true);
      }
    } catch {
      // Revert on error
    } finally {
      setSaving(false);
    }
  };

  // Price per m²
  const ppm2 = property.area && property.area > 0
    ? Math.round(property.price / property.area)
    : null;

  return (
    <Link href={`/property/${property.id}`}>
      <div className="group relative rounded-xl overflow-hidden border border-[#BFDBFE] bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">

        {/* ═══ IMAGE CAROUSEL ═══ */}
        <div className="relative overflow-hidden bg-[#1E3A8A]" style={{ paddingBottom: '56.25%' }}>

          {/* Slides */}
          <div
            className="absolute inset-0 flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 h-full relative">
                <Image
                  src={img || '/images/listing-1.jpg'}
                  alt={`${property.title} foto ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/listing-1.jpg'; }}
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          {totalImages > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[rgba(13,27,42,0.65)] hover:bg-[rgba(13,27,42,0.88)] backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[rgba(13,27,42,0.65)] hover:bg-[rgba(13,27,42,0.88)] backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Foto berikutnya"
              >
                <ChevronRight size={15} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {totalImages > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === currentImageIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Photo count — top-right (below heart button) */}
          <div className="absolute top-10 right-2 z-10 bg-[rgba(13,27,42,0.65)] backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
            <Camera size={10} />
            {totalImages} Foto
          </div>

          {/* ── TOP-RIGHT: Heart button only ── */}
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleFavorite}
              disabled={saving}
              className="w-8 h-8 rounded-full bg-[rgba(13,27,42,0.65)] hover:bg-[rgba(13,27,42,0.88)] backdrop-blur-sm flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              aria-label={isFavorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
            >
              <Heart
                size={14}
                className={`transition-colors duration-200 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </button>
          </div>

          {/* ── TOP-LEFT: Premium · Featured · Hot stack ── */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 items-start">

            {/* PREMIUM badge — gold glow pulse */}
            {property.isPremium && (
              <span
                className="badge-premium inline-flex items-center gap-1.5 bg-[#1E3A8A] text-[#BAE6FD] border border-[rgba(29,78,216,0.55)] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-[6px]"
                style={{ letterSpacing: '0.04em' }}
              >
                <Star size={11} fill="#1D4ED8" stroke="none" />
                PREMIUM
              </span>
            )}

            {/* FEATURED badge — blue metallic shimmer */}
            {property.isFeatured && (
              <span
                className="badge-featured inline-flex items-center gap-1.5 text-[#e0f0ff] border border-[rgba(99,179,237,0.45)] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-[6px]"
                style={{ letterSpacing: '0.04em' }}
              >
                <DiamondIcon />
                FEATURED
              </span>
            )}

            {/* HOT badge — auto from originalPrice */}
            {hot && (
              <span className="inline-flex items-center gap-1 bg-[rgba(155,28,28,0.88)] backdrop-blur-sm text-white text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-[5px]">
                <span className="fire-icon text-[12px]">🔥</span>
                HOT
              </span>
            )}
          </div>

          {/* ── BOTTOM-LEFT: Offer type ── */}
          <div className="absolute bottom-2 left-2 z-10">
            <span
              className={`backdrop-blur-sm text-[9px] font-bold px-2 py-[3px] rounded-[5px] tracking-wide ${
                offerStyle[property.offerType] ?? offerStyle['Dijual']
              }`}
            >
              {property.offerType}
            </span>
          </div>

          {/* ── BOTTOM-RIGHT: Property type ── */}
          <div className="absolute bottom-2 right-2 z-10">
            <span className="bg-[rgba(13,27,42,0.72)] backdrop-blur-sm text-[#EFF6FF] text-[9px] font-bold px-2 py-[3px] rounded-[5px] tracking-wide">
              {property.propertyType}
            </span>
          </div>

        </div>
        {/* ═══ END IMAGE CAROUSEL ═══ */}

        {/* ═══ CARD BODY ═══ */}
        <div className="p-4 bg-white">

          {/* Price row */}
          <div className="flex justify-between items-start gap-2 mb-1">
            <div>
              {/* Strike-through price (HOT) */}
              {hot && property.originalPrice && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatCompact(property.originalPrice)}
                  </span>
                  {savings >= 5 && (
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm">
                      Hemat {savings}%
                    </span>
                  )}
                </div>
              )}

              {/* Current price */}
              <p className="font-heading font-bold text-xl text-[#1D4ED8] leading-tight">
                {formatCompact(property.price)}
                {property.offerType === 'Disewa' && (
                  <span className="text-[11px] text-slate-400 font-normal ml-1">/bln</span>
                )}
              </p>
            </div>

            {/* Certificate badge */}
            {property.certificate && (
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-1 ${certStyle[property.certificate] ?? ''}`}>
                {property.certificate}
              </span>
            )}
          </div>

          {/* Price per m² */}
          {ppm2 && (
            <p className="text-[10px] text-slate-400 font-mono mb-2">
              {formatCompact(ppm2)} / m²
            </p>
          )}

          {/* Title */}
          <h3 className="font-heading font-semibold text-sm text-slate-800 line-clamp-2 leading-snug mb-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-[#1D4ED8] flex-shrink-0" />
            <p className="text-xs text-slate-500 truncate">{property.location}</p>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap text-[11px] text-slate-600">
            {(property.bedrooms ?? 0) > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <BedDouble size={12} className="text-slate-400" />
                  <span>{property.bedrooms} KT</span>
                </div>
                <span className="text-slate-300">·</span>
              </>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <Bath size={12} className="text-slate-400" />
                  <span>{property.bathrooms} KM</span>
                </div>
                <span className="text-slate-300">·</span>
              </>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                <span>{property.area} m²</span>
              </div>
            )}
            {/* Condition */}
            {property.condition && (
              <>
                <span className="text-slate-300">·</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  property.condition === 'Baru'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {property.condition}
                </span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-2" />

          {/* Footer — agent · views · code */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center text-[8px] font-bold flex-shrink-0">
                {property.agentName ? property.agentName.slice(0, 2).toUpperCase() : 'AG'}
              </div>
              <span className="text-[10px] text-slate-600 font-medium truncate max-w-[80px]">
                {property.agentName ?? 'Agent'}
              </span>
              {property.agentVerified && (
                <ShieldCheck size={11} className="text-[#1D4ED8] flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1">
              <Eye size={11} className="text-slate-300" />
              <span className="text-[10px] text-slate-400">{property.views ?? 0}</span>
            </div>

            <span className="font-mono text-[9px] text-[#1D4ED8] opacity-60">
              HOL-{property.id.toString().padStart(4, '0')}
            </span>
          </div>

        </div>
        {/* ═══ END CARD BODY ═══ */}

      </div>
    </Link>
  );
}
