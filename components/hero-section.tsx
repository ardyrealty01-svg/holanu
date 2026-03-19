'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { FilterBar } from './filter-bar';

export function HeroSection() {
  return (
    <section className="relative min-h-[540px] md:min-h-[600px] flex items-center overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-property.jpg"
          alt="Properti Indonesia"
          fill
          className="object-cover"
          priority
        />
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,27,42,0.92)] via-[rgba(13,27,42,0.55)] to-[rgba(13,27,42,0.3)]" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.12)] text-[#BAE6FD] border border-[rgba(255,255,255,0.25)] text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-sm">
            ✨ Platform Properti #1 Indonesia
          </span>
        </div>

        {/* Heading */}
        <h1
          className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white text-center leading-tight mb-4"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}
        >
          Temukan Properti<br />
          <span className="text-[#BAE6FD]">Impianmu</span> di Indonesia
        </h1>

        <p className="text-[#CBD5E0] text-base md:text-lg text-center font-sans mb-8 max-w-2xl mx-auto">
          Ribuan listing rumah, apartemen, kavling & ruko dari agen terpercaya di seluruh Indonesia
        </p>

        {/* Filter bar */}
        <FilterBar />

        {/* Konsultasi CTA */}
        <div className="flex justify-center mt-4">
          <Link
            href="/konsultasi"
            className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(29,78,216,0.25)] text-[#BAE6FD] border border-[rgba(29,78,216,0.4)] text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm transition-all font-sans"
          >
            <MessageCircle size={15} />
            Tidak yakin properti apa yang cocok?
            <span className="underline underline-offset-2">Konsultasi Gratis →</span>
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 md:gap-10 mt-6 flex-wrap">
          {[
            ['12.000+', 'Properti Aktif'],
            ['3.500+',  'Agen Terpercaya'],
            ['24 Kota', 'Se-Indonesia'],
            ['45.000+', 'Terjual & Disewa'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-heading font-bold text-white text-xl md:text-2xl">{val}</p>
              <p className="text-[#94A3B8] text-xs font-sans">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
