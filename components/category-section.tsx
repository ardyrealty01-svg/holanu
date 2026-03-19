'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { propertyTypes } from '@/lib/data';

const EXTRA_TYPES = [
  { name: 'Kost',     count: 234, icon: '🛏️', offerType: 'Disewa' },
  { name: 'Hotel',    count: 45,  icon: '🏨', offerType: 'Disewa' },
  { name: 'Homestay', count: 78,  icon: '🌿', offerType: 'Disewa' },
  { name: 'Villa',    count: 123, icon: '🌴', offerType: 'Dijual' },
  { name: 'Gudang',   count: 67,  icon: '🏭', offerType: 'Dijual' },
];

const PROP_TYPES_WITH_OFFER = propertyTypes.map((t: any) => ({
  ...t,
  offerType: 'Dijual',
}));

const ALL_TYPES = [
  { name: 'Semua', count: null, icon: '🏘️', offerType: null },
  ...PROP_TYPES_WITH_OFFER,
  ...EXTRA_TYPES,
];

export function CategorySection() {
  const router = useRouter();
  const [active, setActive] = useState('Semua');

  const handleClick = (name: string, offerType: string | null) => {
    setActive(name);
    if (name === 'Semua') {
      router.push('/jual');
      return;
    }
    const route = offerType === 'Disewa' ? '/sewa' : '/jual';
    router.push(`${route}?property_type=${encodeURIComponent(name)}`);
  };

  return (
    <section className="py-6 bg-[#EFF6FF] border-b border-[#BFDBFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ALL_TYPES.map(({ name, count, icon, offerType }) => (
            <button
              key={name}
              onClick={() => handleClick(name, offerType)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold font-sans border transition-all ${
                active === name
                  ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                  : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
              }`}
            >
              <span className="text-sm">{icon}</span>
              {name}
              {count !== null && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active === name ? 'bg-[rgba(29,78,216,0.2)] text-[#1D4ED8]' : 'bg-slate-100 text-slate-400'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
