import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ShieldCheck, Star, MapPin } from 'lucide-react';

const agents = [
  { id: 'andi-wijaya',    name: 'Andi Wijaya',   title: 'Senior Agent',   city: 'Sleman, DIY',     rating: 4.9, reviews: 24, sold: 45, tier: 2, initials: 'AW' },
  { id: 'siti-rahayu',    name: 'Siti Rahayu',   title: 'Property Agent', city: 'Kota Yogyakarta', rating: 4.8, reviews: 18, sold: 32, tier: 2, initials: 'SR' },
  { id: 'budi-santoso',   name: 'Budi Santoso',  title: 'Premium Agent',  city: 'Semarang',        rating: 4.7, reviews: 31, sold: 67, tier: 3, initials: 'BS' },
  { id: 'dewi-sartika',   name: 'Dewi Sartika',  title: 'Property Agent', city: 'Makassar',        rating: 4.9, reviews: 12, sold: 28, tier: 2, initials: 'DS' },
  { id: 'rudi-hermawan',  name: 'Rudi Hermawan', title: 'Investor Agent', city: 'Bandung',         rating: 4.6, reviews: 44, sold: 89, tier: 3, initials: 'RH' },
  { id: 'rina-kartika',   name: 'Rina Kartika',  title: 'Property Agent', city: 'Surabaya',        rating: 4.8, reviews: 9,  sold: 21, tier: 1, initials: 'RK' },
  { id: 'ahmad-fajar',    name: 'Ahmad Fajar',   title: 'Property Agent', city: 'Sleman, DIY',     rating: 4.7, reviews: 15, sold: 27, tier: 2, initials: 'AF' },
];

export default function AgenPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Temukan Agen Terpercaya</h1>
            <p className="text-sm text-slate-500 font-sans mt-0.5">{agents.length} agen aktif di platform</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map(agent => (
              <Link
                key={agent.id}
                href={`/agen/${agent.id}`}
                className="bg-white rounded-2xl border border-[#BFDBFE] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {agent.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading font-bold text-[#1E3A8A]">{agent.name}</p>
                      {agent.tier >= 2 && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.4)] px-1.5 py-0.5 rounded">
                          <ShieldCheck size={9} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-sans">{agent.title}</p>
                    <p className="text-xs text-slate-400 font-sans flex items-center gap-1 mt-0.5">
                      <MapPin size={9} className="text-[#1D4ED8]" /> {agent.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#F1F5F9]">
                  <div>
                    <div className="flex items-center justify-center gap-0.5">
                      <Star size={11} className="text-[#1D4ED8]" fill="#1D4ED8" />
                      <span className="text-xs font-bold text-[#1E3A8A]">{agent.rating}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-sans">{agent.reviews} ulasan</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D4ED8]">{agent.sold}</p>
                    <p className="text-[9px] text-slate-400 font-sans">terjual</p>
                  </div>
                  <div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      agent.tier === 3 ? 'bg-blue-50 text-blue-700' :
                      agent.tier === 2 ? 'bg-emerald-50 text-emerald-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      Tier {agent.tier}
                    </span>
                    <p className="text-[9px] text-slate-400 font-sans mt-0.5">verifikasi</p>
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
