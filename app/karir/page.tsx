import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

const openings = [
  { role: 'Frontend Engineer',        team: 'Engineering',  type: 'Full-time', location: 'Remote / Yogyakarta' },
  { role: 'Backend Engineer (CF Workers)', team: 'Engineering', type: 'Full-time', location: 'Remote' },
  { role: 'Product Designer (UI/UX)', team: 'Design',       type: 'Full-time', location: 'Remote / Yogyakarta' },
  { role: 'Digital Marketing Specialist', team: 'Growth',   type: 'Full-time', location: 'Yogyakarta' },
  { role: 'Business Development Manager', team: 'Business', type: 'Full-time', location: 'Yogyakarta' },
  { role: 'Content Writer (Properti)', team: 'Content',     type: 'Part-time', location: 'Remote' },
];

export default function KarirPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen">

        {/* Hero */}
        <div className="bg-[#1E3A8A] py-16 px-4 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            Bergabung dengan Tim <span className="text-[#1D4ED8]">HOLANU</span>
          </h1>
          <p className="text-[#CBD5E0] font-sans text-base max-w-xl mx-auto">
            Kami membangun masa depan platform properti Indonesia. Bergabunglah dan jadilah bagian dari perjalanan ini.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

          {/* Values */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: '🚀', title: 'Gerak Cepat',    desc: 'Kami bergerak cepat, belajar lebih cepat, dan tidak takut gagal dalam proses iterasi.' },
              { icon: '🌏', title: 'Remote-friendly', desc: 'Tim tersebar di seluruh Indonesia. Hasil yang penting, bukan lokasi.' },
              { icon: '💡', title: 'Ownership',       desc: 'Setiap anggota tim punya dampak nyata pada produk dan pengguna akhir.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#BFDBFE] p-5 shadow-sm text-center">
                <span className="text-3xl mb-3 block">{icon}</span>
                <h3 className="font-heading font-bold text-[#1E3A8A] mb-1">{title}</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Openings */}
          <h2 className="font-heading font-bold text-xl text-[#1E3A8A] mb-4">Posisi Terbuka</h2>
          <div className="space-y-3">
            {openings.map(({ role, team, type, location }) => (
              <div key={role} className="bg-white rounded-2xl border border-[#BFDBFE] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1D4ED8] transition-colors">
                <div>
                  <p className="font-heading font-bold text-[#1E3A8A]">{role}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2 py-0.5 rounded">{team}</span>
                    <span className="text-[9px] font-bold bg-[#F1F5F9] text-slate-600 px-2 py-0.5 rounded">{type}</span>
                    <span className="text-[9px] text-slate-400 font-sans">📍 {location}</span>
                  </div>
                </div>
                <Link
                  href={`mailto:karir@holanu.id?subject=Lamaran: ${encodeURIComponent(role)}`}
                  className="flex-shrink-0 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors font-sans text-center"
                >
                  Lamar Sekarang
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-[#BFDBFE] p-6 text-center">
            <p className="text-sm text-slate-600 font-sans mb-2">Tidak menemukan posisi yang cocok?</p>
            <p className="text-xs text-slate-400 font-sans mb-4">Kirimkan CV dan portofolio kamu — kami selalu mencari talenta luar biasa.</p>
            <Link
              href="mailto:karir@holanu.id"
              className="inline-flex items-center gap-2 bg-[#1E3A8A] text-[#BAE6FD] font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#1E3A8A] transition-colors font-sans"
            >
              📧 Kirim Lamaran Terbuka
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
