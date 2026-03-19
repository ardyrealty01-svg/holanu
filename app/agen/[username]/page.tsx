import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ListingCard } from '@/components/listing-card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { featuredProperties, latestProperties } from '@/lib/data';
import { ShieldCheck, Star, MapPin, MessageCircle, Phone, Instagram, Globe, ArrowLeft } from 'lucide-react';

/* ── Agent database (sumber tunggal kebenaran) ── */
const AGENTS = [
  {
    id:        'andi-wijaya',
    name:      'Andi Wijaya',
    initials:  'AW',
    title:     'Senior Agent Properti',
    city:      'Sleman, DIY',
    wa:        '628123456789',
    phone:     '+62 812-3456-7890',
    instagram: '@andiwijaya.property',
    website:   '',
    tier:      2,
    rating:    4.9,
    reviews:   24,
    sold:      45,
    bio:       'Spesialis properti area Sleman & Kota Yogyakarta. 10+ tahun pengalaman, 200+ transaksi sukses. Komitmen penuh membantu klien menemukan properti impian dengan proses transparan dan aman.',
    areas:     ['Sleman', 'Depok', 'Mlati', 'Gamping', 'Kota Yogyakarta'],
    certifications: ['Broker Properti Berlisensi', 'AREBI Member'],
  },
  {
    id:        'siti-rahayu',
    name:      'Siti Rahayu',
    initials:  'SR',
    title:     'Property Agent',
    city:      'Kota Yogyakarta',
    wa:        '628139876543',
    phone:     '+62 813-9876-5432',
    instagram: '@sitirahayuproperty',
    website:   '',
    tier:      2,
    rating:    4.8,
    reviews:   18,
    sold:      32,
    bio:       'Spesialis apartemen dan properti komersial di Kota Yogyakarta. Berpengalaman 7 tahun melayani investor dan pembeli pertama dengan pendekatan personal dan jujur.',
    areas:     ['Kota Yogyakarta', 'Gondokusuman', 'Umbulharjo', 'Jetis'],
    certifications: ['Certified Property Consultant'],
  },
  {
    id:        'budi-santoso',
    name:      'Budi Santoso',
    initials:  'BS',
    title:     'Premium Agent',
    city:      'Semarang',
    wa:        '628781234567',
    phone:     '+62 878-1234-5678',
    instagram: '@budisantoso.realty',
    website:   'budiproperty.com',
    tier:      3,
    rating:    4.7,
    reviews:   31,
    sold:      67,
    bio:       'Spesialis properti premium dan villa investasi di Jawa Tengah. Track record kuat di segmen high-end dengan jaringan luas buyer institusional.',
    areas:     ['Semarang', 'Ungaran', 'Ambarawa', 'Magelang'],
    certifications: ['Broker Properti Berlisensi', 'AREBI Member', 'REI Member'],
  },
  {
    id:        'dewi-sartika',
    name:      'Dewi Sartika',
    initials:  'DS',
    title:     'Property Agent',
    city:      'Makassar',
    wa:        '628567890123',
    phone:     '+62 856-7890-1234',
    instagram: '@dewisartika.property',
    website:   '',
    tier:      2,
    rating:    4.9,
    reviews:   12,
    sold:      28,
    bio:       'Agen properti Makassar dan Sulawesi Selatan. Fokus pada properti residensial dan komersial untuk kalangan profesional muda dan keluarga.',
    areas:     ['Makassar', 'Gowa', 'Maros', 'Takalar'],
    certifications: ['Certified Property Agent'],
  },
  {
    id:        'rudi-hermawan',
    name:      'Rudi Hermawan',
    initials:  'RH',
    title:     'Investor Property Specialist',
    city:      'Bandung',
    wa:        '628954567890',
    phone:     '+62 895-4567-8901',
    instagram: '@rudihermawan.invest',
    website:   'rudiproperty.id',
    tier:      3,
    rating:    4.6,
    reviews:   44,
    sold:      89,
    bio:       'Konsultan investasi properti Bandung Raya dan Jawa Barat. Spesialis analisis ROI, properti kost eksklusif, dan kawasan wisata. Telah membantu 89+ investor melipatgandakan aset mereka.',
    areas:     ['Bandung', 'Cimahi', 'Lembang', 'Banjaran', 'Soreang'],
    certifications: ['Certified Property Consultant', 'Financial Planner', 'REI Member'],
  },
  {
    id:        'rina-kartika',
    name:      'Rina Kartika',
    initials:  'RK',
    title:     'Property Agent',
    city:      'Surabaya',
    wa:        '628214567890',
    phone:     '+62 821-4567-8901',
    instagram: '@rinakartika.property',
    website:   '',
    tier:      1,
    rating:    4.8,
    reviews:   9,
    sold:      21,
    bio:       'Agen properti energik di Surabaya dan sekitarnya. Khusus melayani pembeli pertama (first home buyer) dengan panduan lengkap dari pencarian hingga serah terima kunci.',
    areas:     ['Surabaya', 'Sidoarjo', 'Gresik'],
    certifications: ['Certified Property Agent'],
  },
  {
    id:        'ahmad-fajar',
    name:      'Ahmad Fajar',
    initials:  'AF',
    title:     'Property Agent',
    city:      'Sleman, DIY',
    wa:        '628123456789',
    phone:     '+62 812-3456-7890',
    instagram: '@ahmadfajar.property',
    website:   '',
    tier:      2,
    rating:    4.7,
    reviews:   15,
    sold:      27,
    bio:       'Agen properti berpengalaman di area Sleman dan sekitarnya. Fokus melayani keluarga muda dan investor yang mencari properti residensial berkualitas dengan harga kompetitif.',
    areas:     ['Sleman', 'Depok', 'Kalasan', 'Ngemplak'],
    certifications: ['Certified Property Agent', 'AREBI Member'],
  },
];

const tierLabel: Record<number, string> = {
  1: '🟡 Tier 1 — Terverifikasi Email & WA',
  2: '🟢 Tier 2 — Terverifikasi KTP',
  3: '🔵 Tier 3 — Terverifikasi Identitas Penuh',
};

export default function AgenProfilePage({ params }: { params: { username: string } }) {
  const agent = AGENTS.find(a => a.id === params.username);

  // Fallback jika username tidak ditemukan
  if (!agent) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-[#EFF6FF]">
          <div className="text-center px-4">
            <p className="text-5xl mb-4">👤</p>
            <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] mb-2">Agent Tidak Ditemukan</h1>
            <p className="text-slate-500 font-sans mb-6 text-sm">Profil agent ini tidak tersedia.</p>
            <Link href="/agen"
              className="bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans text-sm">
              ← Lihat Semua Agen
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Fetch listing dari API, fallback ke static
  let displayListings: any[] = [];
  try {
    const res = await import('@/lib/api').then(m => m.getListings({ q: agent.name, limit: 6 }));
    if (res.listings.length > 0) {
      const { listingToProperty } = await import('@/lib/api');
      displayListings = res.listings.map(listingToProperty);
    }
  } catch {}

  // Fallback ke static data jika API kosong
  if (displayListings.length === 0) {
    const allStatic = [
      ...featuredProperties,
      ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id)),
    ];
    displayListings = allStatic
      .filter(p => p.agentName?.toLowerCase() === agent.name.toLowerCase())
      .slice(0, 6);
    if (displayListings.length === 0) displayListings = allStatic.slice(0, 3);
  }

  const waMsg = encodeURIComponent(
    `Halo, ${agent.name} 👋\n\nSaya ingin mengetahui lebih lanjut tentang properti yang Anda pasarkan di HOLANU.\n\nBisakah kita berdiskusi?\n\nTerima kasih 🙏`
  );

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">

        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] relative">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <span className="text-9xl text-[#1D4ED8]">◆</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

          {/* Back link */}
          <div className="pt-4 mb-4">
            <Link href="/agen"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#1D4ED8] transition-colors font-sans w-fit">
              <ArrowLeft size={13} /> Semua Agen
            </Link>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 mb-6 -mt-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-5">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md flex-shrink-0">
                {agent.initials}
              </div>

              {/* Identity */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-heading font-bold text-xl text-[#1E3A8A]">{agent.name}</h1>
                  {agent.tier >= 2 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.4)] px-1.5 py-0.5 rounded">
                      <ShieldCheck size={9} /> ID Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-sans">{agent.title}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400 font-sans">
                  <span className="flex items-center gap-1"><MapPin size={11} className="text-[#1D4ED8]" /> {agent.city}</span>
                  <span className="flex items-center gap-1"><Star size={11} className="text-[#1D4ED8]" fill="#1D4ED8" /> {agent.rating}/5 ({agent.reviews} ulasan)</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <a
                  href={`https://wa.me/${agent.wa}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1DB954] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors font-sans"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-2 border border-[#BFDBFE] text-slate-600 text-sm font-semibold px-3 py-2.5 rounded-xl hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors font-sans"
                >
                  <Phone size={14} /> {agent.phone}
                </a>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-[#F1F5F9]">
              {[
                { label: 'Properti Terjual', value: agent.sold },
                { label: 'Ulasan',           value: agent.reviews },
                { label: 'Rating',           value: `${agent.rating}/5` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#EFF6FF] rounded-xl p-3 text-center">
                  <p className="font-heading font-bold text-xl text-[#1D4ED8]">{value}</p>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 font-sans leading-relaxed mb-5">
              {agent.bio}
            </p>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-5">

              {/* Area spesialis */}
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">Area Spesialis</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.areas.map(a => (
                    <span key={a} className="text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8] px-3 py-1 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sertifikasi */}
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">Sertifikasi & Keanggotaan</p>
                <div className="space-y-1">
                  {agent.certifications.map(c => (
                    <div key={c} className="flex items-center gap-1.5 text-xs text-slate-600 font-sans">
                      <ShieldCheck size={11} className="text-emerald-500 flex-shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-5 pt-5 border-t border-[#F1F5F9]">
              {agent.instagram && (
                <a href={`https://instagram.com/${agent.instagram.replace('@','')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-pink-500 transition-colors font-sans">
                  <Instagram size={14} /> {agent.instagram}
                </a>
              )}
              {agent.website && (
                <a href={`https://${agent.website}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1D4ED8] transition-colors font-sans">
                  <Globe size={14} /> {agent.website}
                </a>
              )}
              {/* Tier badge */}
              <div className="ml-auto">
                <span className="text-[10px] text-slate-400 font-sans">{tierLabel[agent.tier]}</span>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">
                Listing Aktif
                <span className="ml-2 text-sm font-sans font-normal text-slate-400">({displayListings.length})</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayListings.map(p => <ListingCard key={p.id} property={p} />)}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
