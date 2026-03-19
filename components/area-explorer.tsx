'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { cities } from '@/lib/data';

export function AreaExplorer() {
  return (
    <section className="py-12 md:py-16 bg-[#EFF6FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A]">
              Jelajahi Berdasarkan Kota
            </h2>
            <p className="text-slate-500 text-sm font-sans mt-1">
              Temukan properti di kota pilihanmu
            </p>
          </div>
          <Link
            href="/jual"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors font-sans flex-shrink-0"
          >
            Semua Kota <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cities.map(city => (
            <Link
              key={city.name}
              href={`/jual?city=${encodeURIComponent(city.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#1E3A8A] cursor-pointer hover:ring-2 hover:ring-[#1D4ED8] transition-all"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 via-[#1E3A8A]/30 to-transparent z-10" />

              {/* Decorative pattern */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <MapPin size={40} className="text-[#1D4ED8]" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <p className="font-heading font-bold text-white text-sm leading-tight">{city.name}</p>
                <p className="text-[#1D4ED8] text-[10px] font-semibold font-sans mt-0.5">
                  {city.propertyCount.toLocaleString()} properti
                </p>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <ArrowRight size={12} className="text-[#1E3A8A]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
