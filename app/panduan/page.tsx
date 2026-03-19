import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { articles } from '@/lib/data';
import { Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Semua', 'Tips & Panduan', 'Market Insights', 'Investment', 'KPR', 'Legal'];

const CATEGORY_COLOR: Record<string, string> = {
  'Tips & Panduan': 'bg-blue-50 text-blue-700',
  'Market Insights':'bg-amber-50 text-amber-700',
  'Investment':     'bg-emerald-50 text-emerald-700',
};

export default function PanduanPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Panduan & Tips Properti</h1>
            <p className="text-slate-500 font-sans">Edukasi untuk pembeli, penyewa, dan investor cerdas Indonesia</p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ${
                  c === activeCategory ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]' : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...articles, ...articles, ...articles].slice(0, 9).map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/panduan/${article.id}`}
                className="group bg-white rounded-2xl border border-[#BFDBFE] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-44 bg-[#1E3A8A] overflow-hidden flex items-center justify-center">
                  <span className="text-5xl opacity-20">📰</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/60 to-transparent" />
                  <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-md ${CATEGORY_COLOR[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {article.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-sm text-[#1E3A8A] line-clamp-2 leading-snug mb-2 group-hover:text-[#1D4ED8] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                    <span className="flex items-center gap-1"><Clock size={10} /> 5 menit baca</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
