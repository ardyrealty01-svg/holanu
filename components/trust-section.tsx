'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, Home, Star } from 'lucide-react';

export function TrustSection() {
  const STATS = [
    { icon: Home,        value: 12000, label: 'Properti Aktif',      format: (n: number) => n.toLocaleString('id-ID') + '+' },
    { icon: ShieldCheck, value: 3500,   label: 'Agen Terverifikasi',  format: (n: number) => n.toLocaleString('id-ID') + '+' },
    { icon: TrendingUp,  value: 2400000000000, label: 'Nilai Transaksi', format: (n: number) => 'Rp ' + (n/1e12).toFixed(1).replace(/\.0$/, '') + 'T+' },
    { icon: Star,        value: 98,     label: 'Kepuasan Pengguna',   format: (n: number) => n + '%'   },
  ];

  const TESTIMONIALS = [
    {
      name: 'Ahmad Fajar', role: 'Pembeli Pertama', city: 'Yogyakarta', initials: 'AF', rating: 5,
      text: 'Proses cari rumah jadi jauh lebih mudah. Fitur filter lokasinya sangat membantu, dan agen yang saya hubungi responsif banget!',
    },
    {
      name: 'Dewi Sartika', role: 'Agen Properti', city: 'Semarang', initials: 'DS', rating: 5,
      text: 'Sejak pasang listing di HOLANU, inquiry WA saya naik 3x lipat. Dashboard analitiknya juga sangat membantu performa saya.',
    },
    {
      name: 'Rudi Hermawan', role: 'Investor Properti', city: 'Makassar', initials: 'RH', rating: 5,
      text: 'Kalkulator ROI-nya sangat membantu untuk analisis investasi. Data tren harga per area juga akurat dan selalu update.',
    },
  ];

  const [animatedValues, setAnimatedValues] = useState(STATS.map(s => 0));

  useEffect(() => {
    // Animate each stat from 0 to target value
    const intervals = STATS.map((stat, index) => {
      const target = stat.value;
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();
      
      let animationFrameId: number;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = Math.sqrt(progress); // easeOut effect
        const currentValue = Math.floor(easedProgress * target);
        
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    });
    
    // Cleanup function to stop all animations
    return () => {
      intervals.forEach(clear => clear());
    };
  }, []);

  return (
    <section className="py-12 md:py-16 bg-[#EFF6FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#BFDBFE] rounded-2xl overflow-hidden mb-12 shadow-sm">
            {STATS.map(({ icon: Icon, value, label, format }, index) => (
              <div key={label} className="bg-white flex flex-col items-center justify-center py-6 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center mb-2">
                  <Icon size={18} className="text-[#1D4ED8]" />
                </div>
                <p className="font-heading font-bold text-2xl text-[#C9A84C]">{format(animatedValues[index])}</p>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        
          {/* Testimonials */}
          <div className="text-center mb-6">
            <h2 className="font-heading font-bold text-2xl text-[#1E3A8A]">Kata Mereka tentang HOLANU</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, city, initials, rating, text }) => (
              <div key={name} className="bg-white rounded-2xl border border-[#BFDBFE] p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Quote mark */}
                <div className="text-4xl text-[#DBEAFE] font-serif leading-none mb-3 select-none">"</div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-[#1D4ED8]" fill="#1D4ED8" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 font-display leading-relaxed mb-4 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#F1F5F9]">
                  <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E3A8A] font-heading">{name}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{role} · {city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}