'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HOLANU_WA_NUMBER } from '@/lib/contact';
import {
  Heart, MapPin, BedDouble, Bath, Building2, Maximize2,
  Share2, Eye, ShieldCheck, Star,
  Phone, MessageCircle, ChevronLeft, ChevronRight,
  Info, Camera,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { RegisterPopup } from '@/components/register-popup';
import { Property, isHot, savingsPercent } from '@/lib/data';

const SITE_URL = 'https://holanu.id';

interface Props {
  property: Property;
  related: Property[];
}

export default function PropertyClient({ property, related }: Props) {
  const { isSignedIn }             = useUser();
  const IS_LOGGED_IN               = !!isSignedIn;

  const [imgIdx, setImgIdx]        = useState(0);
  const [saved, setSaved]          = useState(false);
  const [popupOpen, setPopup]      = useState(false);
  const [popupTrigger, setTrigger] = useState<'contact' | 'save' | 'message'>('contact');

  const openPopup = (trigger: 'contact' | 'save' | 'message') => {
    if (IS_LOGGED_IN) return;
    setTrigger(trigger);
    setPopup(true);
  };

  const hot     = isHot(property);
  const savings = savingsPercent(property);
  const images  = (() => {
    // Use real images from API (already parsed in listingToProperty)
    const imgs = (property as any).images;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs as string[];
    // Fallback: single image from property.image
    return property.image ? [property.image] : ['/images/listing-1.jpg'];
  })();
  const code    = (property as any).code
    ?? (/^\d+$/.test(property.id) ? `HOL-YGY-25-${property.id.padStart(4, '0')}` : `HOL-${property.id.slice(0, 8).toUpperCase()}`);
  const url     = `${process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL}/property/${property.id}`;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      notation: 'compact', maximumFractionDigits: 0,
    }).format(price);

  /* ── WhatsApp message builder ── */
  const buildWAMessage = () => {
    const agentName = property.agentName ?? 'Agen HOLANU';
    const specs = [
      property.bedrooms  ? `🛏 ${property.bedrooms} KT` : null,
      property.bathrooms ? `🚿 ${property.bathrooms} KM` : null,
      property.area      ? `📐 ${property.area} m²`     : null,
    ].filter(Boolean).join(' · ');

    return [
      `Halo, ${agentName} 👋`,
      ``,
      `Saya tertarik dengan properti berikut:`,
      ``,
      `🏠 *${property.title}*`,
      `📍 ${property.location}`,
      `💰 ${formatPrice(property.price)}${property.offerType === 'Disewa' ? '/bulan' : ''}`,
      property.certificate ? `🔑 ${property.certificate}` : null,
      specs ? `📊 ${specs}` : null,
      `🆔 Kode: ${code}`,
      ``,
      `🔗 ${url}`,
      ``,
      `Apakah properti ini masih tersedia? Saya ingin info lebih lanjut.`,
      ``,
      `Terima kasih 🙏`,
    ].filter(line => line !== null).join('\n');
  };

  const handleWA = () => {
    if (!IS_LOGGED_IN) { openPopup('message'); return; }
    const msg = buildWAMessage();
    // Use real agent WA from API data, fallback to placeholder
    const agentWa = (property as any).agent_wa ?? (property as any).agentWa;
    const waNumber = agentWa
      ? agentWa.replace(/\D/g, '').replace(/^0/, '62')
      : HOLANU_WA_NUMBER;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = { title: property.title, text: `${property.title} — ${formatPrice(property.price)}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else {
      navigator.clipboard.writeText(url);
      alert('Link disalin ke clipboard!');
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mb-4 flex-wrap">
            <Link href="/" className="hover:text-[#1D4ED8] transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/jual" className="hover:text-[#1D4ED8] transition-colors">{property.offerType}</Link>
            <span>/</span>
            <Link href={
              ['rumah','apartemen','tanah','ruko'].includes(property.propertyType.toLowerCase())
                ? `/jual/${property.propertyType.toLowerCase()}`
                : '/jual'
            } className="hover:text-[#1D4ED8] transition-colors">{property.propertyType}</Link>
            <span>/</span>
            <span className="text-[#1E3A8A] truncate max-w-[200px]">{property.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left col ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Image gallery */}
              <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex transition-transform duration-300"
                    style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
                    {images.map((img, i) => (
                      <div key={i} className="w-full flex-shrink-0 h-full relative bg-[#1E3A8A]">
                        <Image src={img || '/images/listing-1.jpg'} alt={`${property.title} foto ${i + 1}`} fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/listing-1.jpg'; }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} disabled={imgIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[rgba(13,27,42,0.7)] text-white flex items-center justify-center disabled:opacity-30 transition-all hover:bg-[rgba(13,27,42,0.9)]">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))} disabled={imgIdx === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[rgba(13,27,42,0.7)] text-white flex items-center justify-center disabled:opacity-30 transition-all hover:bg-[rgba(13,27,42,0.9)]">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute top-3 right-3 bg-[rgba(13,27,42,0.7)] text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1.5">
                    <Camera size={12} /> {images.length} Foto
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {property.isPremium && <span className="badge-premium inline-flex items-center gap-1.5 bg-[#1E3A8A] text-[#BAE6FD] border border-[rgba(29,78,216,0.55)] text-[10px] font-extrabold px-2 py-0.5 rounded-[6px]"><Star size={10} fill="#1D4ED8" stroke="none" />PREMIUM</span>}
                    {property.isFeatured && !property.isPremium && <span className="badge-featured inline-flex items-center gap-1.5 text-[#e0f0ff] border border-[rgba(99,179,237,0.45)] text-[10px] font-extrabold px-2 py-0.5 rounded-[6px]">♦ FEATURED</span>}
                    {hot && <span className="inline-flex items-center gap-1 bg-[rgba(155,28,28,0.88)] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-[5px]">🔥 HOT</span>}
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`rounded-full transition-all ${i === imgIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`relative w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#1D4ED8]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <Image src={img || '/images/listing-1.jpg'} alt="" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/listing-1.jpg'; }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Listing info */}
              <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-5">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-[rgba(13,27,42,0.08)] text-[#1E3A8A]">{property.offerType}</span>
                  <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2 py-1 rounded-md">{property.propertyType}</span>
                  {property.certificate && <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md">{property.certificate}</span>}
                  {property.condition   && <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{property.condition}</span>}
                </div>
                <h1 className="font-heading font-bold text-xl text-[#1E3A8A] leading-snug mb-3">{property.title}</h1>
                <div className="mb-3">
                  {hot && property.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-400 line-through">{formatPrice(property.originalPrice)}</span>
                      {savings >= 5 && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Hemat {savings}%</span>}
                    </div>
                  )}
                  <p className="font-heading font-bold text-3xl text-[#1D4ED8]">{formatPrice(property.price)}</p>
                  {property.area && <p className="text-xs text-slate-400 font-mono mt-0.5">{formatPrice(Math.round(property.price / property.area))} / m²</p>}
                </div>
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-sans mb-4 pb-4 border-b border-[#F1F5F9]">
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#1D4ED8]" />{property.location}</span>
                  {property.views && <span className="flex items-center gap-1.5"><Eye size={12} />{property.views} dilihat</span>}
                  <span className="font-mono text-[10px] text-[#1D4ED8] opacity-70">{code}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: BedDouble,  label: 'Kamar Tidur',   value: property.bedrooms  ? `${property.bedrooms} KT`   : null },
                    { icon: Bath,       label: 'Kamar Mandi',   value: property.bathrooms ? `${property.bathrooms} KM`  : null },
                    { icon: Maximize2,  label: 'Luas Tanah',    value: property.area      ? `${property.area} m²`       : null },
                    { icon: Building2,  label: 'Luas Bangunan', value: property.area      ? `${property.area} m²`       : null },
                  ].filter(s => s.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-[#EFF6FF] rounded-xl p-3 text-center">
                      <Icon size={18} className="text-[#1D4ED8] mx-auto mb-1" />
                      <p className="font-heading font-bold text-sm text-[#1E3A8A]">{value}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-[#1E3A8A] mb-2">Deskripsi</h2>
                  <p className="text-sm text-slate-600 font-sans leading-relaxed">
                    {(property as any).description
                      ? (property as any).description
                      : `Properti eksklusif berlokasi strategis di ${property.location}. Kondisi ${property.condition ?? 'baik'}, cocok untuk hunian maupun investasi. Lingkungan aman, nyaman, dan dekat fasilitas umum.`}
                  </p>
                </div>
              </div>

              {/* Action bar */}
              <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-4 flex items-center gap-3">
                <button onClick={handleShare}
                  className="flex items-center gap-2 text-xs text-slate-600 font-sans font-medium px-4 py-2 rounded-xl border border-[#BFDBFE] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
                  <Share2 size={14} /> Bagikan
                </button>
                <button
                  onClick={() => IS_LOGGED_IN ? setSaved(v => !v) : openPopup('save')}
                  className={`flex items-center gap-2 text-xs font-sans font-medium px-4 py-2 rounded-xl border transition-colors ${
                    saved ? 'bg-red-50 border-red-200 text-red-500' : 'border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
                  }`}>
                  <Heart size={14} className={saved ? 'fill-red-500' : ''} />
                  {saved ? 'Tersimpan' : 'Simpan'}
                </button>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 font-sans">
                  <Info size={13} /> Diperbarui hari ini
                </div>
              </div>

              {/* Konsultasi Banner */}
              <div className="bg-[#1E3A8A] rounded-2xl border border-[rgba(29,78,216,0.2)] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-white font-heading font-semibold">🔍 Tidak menemukan yang cocok?</p>
                  <p className="text-[#94A3B8] text-xs font-sans mt-1">
                    Ceritakan kriteria idealmu — tim HOLANU bantu carikan dalam 24 jam, <strong className="text-white">GRATIS</strong>.
                  </p>
                </div>
                <Link href="/konsultasi"
                  className="flex-shrink-0 flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors font-sans">
                  💬 Konsultasi Gratis
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#1E3A8A] mb-4">Properti Serupa di {property.location}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {related.map(p => <ListingCard key={p.id} property={p} />)}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right col — Agent card ── */}
            <div>
              <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-md p-5 lg:sticky lg:top-24">

                {/* Agent info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F1F5F9]">
                  <div className="w-14 h-14 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {property.agentName ? property.agentName.slice(0, 2).toUpperCase() : 'AG'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-[#1E3A8A]">{property.agentName ?? 'Agent HOLANU'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {property.agentVerified && (
                        <span className="flex items-center gap-1 text-[10px] text-[#1D4ED8] font-bold border border-[rgba(29,78,216,0.35)] px-1.5 py-0.5 rounded">
                          <ShieldCheck size={9} /> Terverifikasi
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
                        <Star size={9} className="text-[#1D4ED8]" fill="#1D4ED8" /> 4.9/5
                      </span>
                    </div>
                    <Link href={`/agen/${(property.agentName ?? 'agent').toLowerCase().replace(/ /g, '-')}`}
                      className="text-[10px] text-[#1D4ED8] hover:underline font-sans mt-0.5 block">
                      Lihat Profil Lengkap →
                    </Link>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-2.5">

                  {/* WhatsApp */}
                  <button
                    onClick={handleWA}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DB954] text-white font-bold py-3.5 rounded-xl transition-colors font-sans text-sm"
                  >
                    <MessageCircle size={18} /> Chat via WhatsApp
                  </button>

                  {/* Preview pesan WA (jika logged in) */}
                  {IS_LOGGED_IN && (
                    <details className="group">
                      <summary className="text-[10px] text-slate-400 font-sans cursor-pointer hover:text-[#1D4ED8] text-center select-none list-none">
                        Lihat preview pesan yang akan dikirim ▾
                      </summary>
                      <div className="mt-2 bg-[#DCF8C6] rounded-xl p-3 text-[10px] font-sans text-slate-700 leading-relaxed whitespace-pre-line border border-[#B2E0A0]">
                        {buildWAMessage()}
                      </div>
                    </details>
                  )}

                  {/* Phone */}
                  <button
                    onClick={() => !IS_LOGGED_IN && openPopup('contact')}
                    className="w-full flex items-center justify-center gap-2 border border-[#BFDBFE] hover:border-[#1D4ED8] text-slate-600 hover:text-[#1D4ED8] font-semibold py-3 rounded-xl transition-colors font-sans text-sm"
                  >
                    <Phone size={15} />
                    {IS_LOGGED_IN
                      ? ((property as any).agent_wa
                          ? (property as any).agent_wa.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
                          : 'Hubungi via WhatsApp')
                      : 'Lihat Nomor Telepon'}
                  </button>
                </div>

                {!IS_LOGGED_IN && (
                  <p className="text-center text-[10px] text-slate-400 font-sans mt-3 flex items-center justify-center gap-1">
                    🔒 Daftar gratis untuk melihat kontak agen
                  </p>
                )}

                {/* KPR mini */}
                <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                  <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">💰 Estimasi Cicilan KPR</p>
                  <div className="bg-[#EFF6FF] rounded-xl p-3 text-xs font-sans">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">DP 20%</span>
                      <span className="font-bold text-[#1E3A8A]">{formatPrice(property.price * 0.2)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Pinjaman</span>
                      <span className="font-bold text-[#1E3A8A]">{formatPrice(property.price * 0.8)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#BFDBFE] mt-2">
                      <span className="text-slate-500">~Cicilan/bulan</span>
                      <span className="font-bold text-[#1D4ED8]">{formatPrice(Math.round((property.price * 0.8 / (20 * 12)) * 1.2))}</span>
                    </div>
                  </div>
                  <Link href="/kalkulator/kpr" className="block text-center text-[10px] text-[#1D4ED8] hover:underline font-sans mt-2">
                    Simulasi Lengkap →
                  </Link>
                </div>

                <button
                  onClick={() => {
                    const reason = prompt('Alasan laporan:');
                    if (reason) alert('✅ Laporan diterima. Tim kami akan meninjau dalam 24 jam.');
                  }}
                  className="block mx-auto text-[10px] text-slate-300 hover:text-red-400 font-sans mt-4 transition-colors"
                >
                  🚩 Laporkan Listing Ini
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile sticky */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#BFDBFE] shadow-lg px-4 py-3 z-40 flex items-center gap-3">
        <div className="flex-1">
          <p className="font-heading font-bold text-[#1D4ED8] text-lg leading-tight">{formatPrice(property.price)}</p>
          <p className="text-[10px] text-slate-400 font-sans">{property.propertyType} · {property.offerType}</p>
        </div>
        <button onClick={handleWA}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1DB954] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors font-sans">
          <MessageCircle size={15} /> WhatsApp
        </button>
        <button onClick={() => !IS_LOGGED_IN ? openPopup('contact') : undefined}
          className="flex items-center gap-2 border border-[#BFDBFE] text-slate-600 text-sm font-semibold px-3 py-2.5 rounded-xl hover:border-[#1D4ED8] transition-colors font-sans"
          title={IS_LOGGED_IN ? ((property as any).agent_wa ?? (property as any).agentWa ?? HOLANU_WA_NUMBER) : 'Login untuk lihat nomor'}
        >
          <Phone size={15} />
          {IS_LOGGED_IN && (
            <span className="text-xs font-mono">
              {((property as any).agent_wa ?? (property as any).agentWa ?? HOLANU_WA_NUMBER)
                .replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')}
            </span>
          )}
        </button>
      </div>
      <div className="lg:hidden h-16" />

      <Footer />
      <RegisterPopup isOpen={popupOpen} onClose={() => setPopup(false)} trigger={popupTrigger} />
    </>
  );
}
