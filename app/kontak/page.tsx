'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Mail, Phone, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';

export default function KontakPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <h1 className="font-heading font-bold text-3xl text-[#1E3A8A] mb-2">Hubungi Kami</h1>
            <p className="text-slate-500 font-sans">Tim kami siap membantu kamu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Contact info */}
            <div className="space-y-4">
              {[
                { icon: MessageCircle, label: 'WhatsApp',   value: '+62 812-HOLANU', sub: 'Respons < 30 menit (jam kerja)', color: 'text-[#25D366]', bg: 'bg-emerald-50' },
                { icon: Mail,          label: 'Email',      value: 'support@holanu.id', sub: 'Respons < 24 jam', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Phone,         label: 'Telepon',    value: '+62 274-000-0000', sub: 'Senin–Jumat, 09.00–17.00 WIB', color: 'text-[#1D4ED8]', bg: 'bg-[#DBEAFE]' },
                { icon: MapPin,        label: 'Kantor',     value: 'Yogyakarta, DIY', sub: 'Indonesia', color: 'text-red-500', bg: 'bg-red-50' },
              ].map(({ icon: Icon, label, value, sub, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-[#BFDBFE] p-4 flex items-center gap-4 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 font-sans uppercase tracking-wide">{label}</p>
                    <p className="font-heading font-bold text-[#1E3A8A]">{value}</p>
                    <p className="text-xs text-slate-400 font-sans">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <h2 className="font-heading font-bold text-xl text-[#1E3A8A] mb-2">Pesan Terkirim!</h2>
                  <p className="text-sm text-slate-500 font-sans">Kami akan membalas dalam waktu 24 jam.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-heading font-semibold text-[#1E3A8A] mb-4">Kirim Pesan</h2>
                  <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Nama *</label>
                        <input required type="text" placeholder="Nama lengkap" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Email *</label>
                        <input required type="email" placeholder="email@contoh.com" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Subjek *</label>
                      <input required type="text" placeholder="Topik pertanyaan" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Pesan *</label>
                      <textarea required rows={5} placeholder="Tulis pesan kamu di sini..." className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300" />
                    </div>
                    <button type="submit" className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-3 rounded-xl transition-colors font-sans">
                      Kirim Pesan
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
