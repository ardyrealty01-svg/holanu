'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { articles } from '@/lib/data';

const CATEGORY_COLOR: Record<string, string> = {
  'Tips & Panduan': 'bg-blue-50   text-blue-700',
  'Market Insights':'bg-amber-50  text-amber-700',
  'Investment':     'bg-emerald-50 text-emerald-700',
};

export function ArticlesSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A]">
              Panduan & Tips Properti
            </h2>
            <p className="text-slate-500 text-sm font-sans mt-1">
              Edukasi untuk pembeli, penyewa, dan investor cerdas
            </p>
          </div>
          <Link
            href="/panduan"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors font-sans flex-shrink-0"
          >
            Lihat Semua Artikel <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {articles.map(article => (
            <Link
              key={article.id}
              href={`/panduan/${article.id}`}
              className="group bg-white rounded-2xl border border-[#BFDBFE] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Image placeholder */}
              <div className="relative h-44 bg-[#1E3A8A] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <span className="text-6xl">📰</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/60 to-transparent" />
                <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-md ${CATEGORY_COLOR[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {article.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-heading font-bold text-sm text-[#1E3A8A] line-clamp-2 leading-snug mb-2 group-hover:text-[#1D4ED8] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans line-clamp-2 mb-3 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> 5 menit baca
                  </span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
