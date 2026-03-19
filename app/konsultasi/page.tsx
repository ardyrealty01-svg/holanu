'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { submitLead } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import {
  ChevronRight, ChevronLeft, CheckCircle2, User,
  Phone, MapPin, Home, Wallet, Clock, FileText,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { n: 1, icon: User,     label: 'Identitas'   },
  { n: 2, icon: Home,     label: 'Kebutuhan'   },
  { n: 3, icon: Wallet,   label: 'Finansial'   },
  { n: 4, icon: FileText, label: 'Preferensi'  },
];

const PROPERTY_TYPES = ['Rumah', 'Tanah', 'Kost', 'Hotel', 'Homestay', 'Villa', 'Ruko', 'Gudang', 'Lainnya'];
const PURPOSES       = ['Hunian Pribadi', 'Investasi', 'Usaha / Komersial', 'Sewa Kembali'];
const PAYMENTS       = ['Cash Keras', 'KPR Bank', 'Cash Bertahap', 'Belum Tahu'];
const TIMELINES      = ['Secepatnya (< 1 bulan)', '1–3 bulan', '3–6 bulan', '6–12 bulan', '> 1 tahun'];
const FACILITIES     = ['Dekat Sekolah', 'Dekat Rumah Sakit', 'Dekat Tol', 'Dekat Kampus', 'Dekat Pusat Kota', 'Cluster / One Gate', 'Dekat Stasiun'];
const CERTS          = ['SHM (Sertifikat Hak Milik)', 'HGB (Hak Guna Bangunan)', 'Semua Jenis', 'Tidak Tahu'];
const CONDITIONS     = ['Baru', 'Bekas', 'Keduanya'];
const JOBS           = ['Karyawan Swasta', 'PNS / BUMN', 'Wiraswasta', 'Profesional (Dokter/Pengacara/dll)', 'TNI / Polri', 'Pensiunan', 'Lainnya'];
const PROVINCES      = ['DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Banten', 'Bali', 'Sumatera Utara', 'Sulawesi Selatan', 'Kalimantan Timur'];

const formatRp = (v: string) => {
  const n = v.replace(/\D/g, '');
  return n ? parseInt(n).toLocaleString('id-ID') : '';
};

export default function KonsultasiPage() {
  const [step, setStep]     = useState<Step>(1);
  const [done, setDone]     = useState(false);
  const [fac,  setFac]      = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ── Form state (Step 1) ──
  const [nama,       setNama]      = useState('');
  const [wa,         setWa]        = useState('');
  const [domProv,    setDomProv]   = useState('');
  const [domKota,    setDomKota]   = useState('');
  const [pekerjaan,  setPekerjaan] = useState('');
  // ── Step 2 ──
  const [propType,   setPropType]  = useState('');
  const [tujuan,     setTujuan]    = useState('');
  const [lokasiProv, setLokasiProv] = useState('');
  const [lokasiArea, setLokasiArea] = useState('');
  const [minKT,      setMinKT]     = useState('');
  const [minLT,      setMinLT]     = useState('');
  const [minLB,      setMinLB]     = useState('');
  // ── Step 3 ──
  const [budgetMax,  setBudgetMax] = useState('');
  const [budgetMin,  setBudgetMin] = useState('');
  const [payment,    setPayment]   = useState('');
  const [timeline,   setTimeline]  = useState('');
  const [kprChecks,  setKprChecks] = useState<string[]>([]);
  // ── Step 4 ──
  const [cert,       setCert]      = useState('');
  const [kondisi,    setKondisi]   = useState('');
  const [catatan,    setCatatan]   = useState('');

  const toggleFac = (f: string) =>
    setFac(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const toggleKpr = (k: string) =>
    setKprChecks(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

  const parseRp = (v: string) => parseInt(v.replace(/\D/g, '')) || 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    if (!nama.trim()) { setSubmitError('Nama wajib diisi'); setSubmitting(false); return; }
    if (!wa.trim())   { setSubmitError('WhatsApp wajib diisi'); setSubmitting(false); return; }
    try {
      await submitLead({
        name:            nama.trim(),
        whatsapp:        wa.replace(/\D/g, '').startsWith('0') ? `62${wa.replace(/\D/g,'').slice(1)}` : wa.replace(/\D/g,''),
        domisili_kota:   domKota  || undefined,
        domisili_prov:   domProv  || undefined,
        pekerjaan:       pekerjaan || undefined,
        property_type:   propType  || undefined,
        purpose:         tujuan    || undefined,
        lokasi_incaran:  lokasiArea || undefined,
        lokasi_prov:     lokasiProv || undefined,
        min_bedrooms:    minKT ? parseInt(minKT) : undefined,
        min_land_area:   minLT ? parseInt(minLT) : undefined,
        budget_min:      budgetMin ? parseRp(budgetMin) : undefined,
        budget_max:      budgetMax ? parseRp(budgetMax) : undefined,
        payment_method:  payment   || undefined,
        timeline:        timeline  || undefined,
        certificate:     cert      || undefined,
        condition:       kondisi   || undefined,
        facilities:      fac,
        notes:           catatan   || undefined,
        source:          'form',
      });
      setDone(true);
    } catch (err: any) {
      setSubmitError('Gagal mengirim. Coba lagi dalam beberapa saat.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── DONE ──
  if (done) {
    return (
      <>
        <Navbar />
        <div className="bg-[#EFF6FF] min-h-screen flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-[#2D6A4F]" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] mb-2">
              Konsultasi Terkirim!
            </h1>
            <p className="text-sm text-slate-500 font-sans mb-6 leading-relaxed">
              Tim HOLANU akan menghubungi kamu via WhatsApp dalam <strong className="text-[#1E3A8A]">24 jam</strong> dengan rekomendasi properti yang sesuai.
            </p>
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 mb-6 text-left space-y-2">
              <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-2">Yang akan kamu dapatkan:</p>
              {[
                '✓ Daftar listing properti sesuai kriteria kamu',
                '✓ Estimasi harga pasar area yang kamu incar',
                '✓ Konsultasi KPR jika memilih skema KPR',
                '✓ Rekomendasi agen terpercaya di area tersebut',
              ].map(item => (
                <p key={item} className="text-xs text-slate-600 font-sans">{item}</p>
              ))}
            </div>
            <a
              href="/"
              className="block w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-3 rounded-xl transition-colors font-sans text-sm"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#EFF6FF] min-h-screen py-10">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-[#1E3A8A] text-[#BAE6FD] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              🎯 Gratis & Tanpa Kewajiban
            </span>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#1E3A8A] mb-2">
              Konsultasi Properti Gratis
            </h1>
            <p className="text-slate-500 font-sans text-sm">
              Ceritakan kebutuhanmu — tim HOLANU bantu carikan properti terbaik dalam 24 jam
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.map(({ n, icon: Icon, label }, i) => (
              <div key={n} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    n < step  ? 'bg-[#1D4ED8] text-white' :
                    n === step ? 'bg-[#1E3A8A] text-[#BAE6FD] ring-2 ring-[#1D4ED8] ring-offset-2' :
                    'bg-[#BFDBFE] text-slate-400'
                  }`}>
                    {n < step ? <CheckCircle2 size={18} /> : <Icon size={17} />}
                  </div>
                  <span className={`text-[10px] mt-1 font-sans font-medium hidden sm:block ${
                    n === step ? 'text-[#1E3A8A]' : n < step ? 'text-[#1D4ED8]' : 'text-slate-400'
                  }`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-colors ${n < step ? 'bg-[#1D4ED8]' : 'bg-[#BFDBFE]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 sm:p-8">

            {/* ── STEP 1: Identitas ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="mb-5">
                  <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Data Diri</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Data kamu 100% aman dan tidak dibagikan ke publik</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Nama Lengkap *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={nama} onChange={e => setNama(e.target.value)} required type="text" placeholder="Nama lengkap Anda" className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">No. WhatsApp Aktif *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans">+62</span>
                      <input value={wa} onChange={e => setWa(e.target.value)} required type="tel" placeholder="812-XXXX-XXXX" className="w-full pl-12 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Provinsi Domisili *</label>
                    <select value={domProv} onChange={e => setDomProv(e.target.value)} required className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                      <option value="">Pilih Provinsi</option>
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kota / Kabupaten Domisili *</label>
                    <input value={domKota} onChange={e => setDomKota(e.target.value)} type="text" placeholder="Contoh: Sleman" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Pekerjaan *</label>
                  <select value={pekerjaan} onChange={e => setPekerjaan(e.target.value)} required className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                    <option value="">Pilih pekerjaan</option>
                    {JOBS.map(j => <option key={j}>{j}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── STEP 2: Kebutuhan Properti ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="mb-5">
                  <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Kebutuhan Properti</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Semakin detail, semakin tepat rekomendasi kami</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Tipe Properti yang Dicari *</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map(t => (
                      <button key={t} type="button" onClick={() => setPropType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-all ${propType === t ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Tujuan Pembelian *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PURPOSES.map(p => (
                      <label key={p} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors group ${tujuan === p ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#BFDBFE] hover:border-[#1D4ED8]'}`}>
                        <input type="radio" name="purpose" checked={tujuan === p} onChange={() => setTujuan(p)} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                        <span className="text-xs text-[#1E3A8A] font-sans">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Provinsi yang Diinginkan *</label>
                    <select value={lokasiProv} onChange={e => setLokasiProv(e.target.value)} required className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                      <option value="">Pilih Provinsi</option>
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kota / Kecamatan Incaran</label>
                    <input value={lokasiArea} onChange={e => setLokasiArea(e.target.value)} type="text" placeholder="Contoh: Depok, Sleman" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Min. Kamar Tidur</label>
                    <select value={minKT} onChange={e => setMinKT(e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans">
                      <option value="">Tidak ada</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ kamar</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Min. Luas Tanah (m²)</label>
                    <input value={minLT} onChange={e => setMinLT(e.target.value)} type="number" placeholder="Contoh: 72" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Min. Luas Bangunan (m²)</label>
                    <input value={minLB} onChange={e => setMinLB(e.target.value)} type="number" placeholder="Contoh: 50" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Finansial ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="mb-5">
                  <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Finansial & Timeline</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Informasi ini membantu kami menyesuaikan rekomendasi</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Budget Maksimal *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans font-semibold">Rp</span>
                      <input
                        type="text"
                        placeholder="500.000.000"
                        value={budgetMax}
                        onChange={e => setBudgetMax(formatRp(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Budget Minimal (jika ada)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans font-semibold">Rp</span>
                      <input
                        type="text"
                        placeholder="300.000.000"
                        value={budgetMin}
                        onChange={e => setBudgetMin(formatRp(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Rencana Pembayaran *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENTS.map(p => (
                      <label key={p} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors group ${payment === p ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#BFDBFE] hover:border-[#1D4ED8]'}`}>
                        <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                        <span className="text-xs text-[#1E3A8A] font-sans">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* KPR conditional */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Jika KPR — informasi tambahan:</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                      <input type="checkbox" checked={kprChecks.includes('slip_gaji')} onChange={() => toggleKpr('slip_gaji')} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                      Sudah punya slip gaji / NPWP
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                      <input type="checkbox" checked={kprChecks.includes('no_kpr')} onChange={() => toggleKpr('no_kpr')} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                      Belum punya tanggungan KPR aktif
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                      <input type="checkbox" checked={kprChecks.includes('butuh_bantuan')} onChange={() => toggleKpr('butuh_bantuan')} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                      Butuh bantuan pengajuan KPR
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-sans cursor-pointer">
                      <input type="checkbox" checked={kprChecks.includes('simulasi')} onChange={() => toggleKpr('simulasi')} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                      Ingin simulasi cicilan terlebih dahulu
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Kapan Rencana Beli? *</label>
                  <div className="space-y-2">
                    {TIMELINES.map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="timeline" checked={timeline === t} onChange={() => setTimeline(t)} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                        <span className={`text-sm font-sans transition-colors ${timeline === t ? 'text-[#1D4ED8] font-semibold' : 'text-[#1E3A8A] group-hover:text-[#1D4ED8]'}`}>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Preferensi ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="mb-5">
                  <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Preferensi Tambahan</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Opsional — semakin lengkap semakin baik rekomendasinya</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Sertifikat yang Diinginkan</label>
                  <div className="flex flex-wrap gap-2">
                    {CERTS.map(c => (
                      <button key={c} type="button" onClick={() => setCert(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-all ${cert === c ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8]'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Kondisi Properti</label>
                  <div className="flex gap-2">
                    {CONDITIONS.map(c => (
                      <button key={c} type="button" onClick={() => setKondisi(c)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold font-sans border transition-all ${kondisi === c ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8]'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Fasilitas Prioritas <span className="text-slate-400 font-normal">(pilih semua yang relevan)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {FACILITIES.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFac(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-all ${
                          fac.includes(f)
                            ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#1D4ED8]'
                            : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
                        }`}
                      >
                        {fac.includes(f) ? '✓ ' : ''}{f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Catatan Khusus <span className="text-slate-400 font-normal">(opsional)</span></label>
                  <textarea
                    rows={3}
                    value={catatan} onChange={e => setCatatan(e.target.value)}
                    placeholder="Contoh: Lebih suka yang sudah ada bangunan, dekat sekolah internasional, area tidak banjir, dll."
                    className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300"
                  />
                </div>

                {/* Privacy note */}
                <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
                  <span className="text-base flex-shrink-0 mt-0.5">🔒</span>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Data kamu <strong className="text-[#1E3A8A]">tidak pernah ditampilkan ke publik</strong> atau dibagikan ke agen tanpa seizin kamu. 
                    Tim HOLANU yang akan menghubungi kamu secara langsung via WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F1F5F9]">
              <button
                onClick={() => step > 1 && setStep(s => (s - 1) as Step)}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm font-semibold text-slate-600 hover:border-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-sans"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>

              <span className="text-xs text-slate-400 font-sans">
                Step {step} dari {STEPS.length}
              </span>

              {step < 4 ? (
                <button
                  onClick={() => setStep(s => (s + 1) as Step)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-sm font-bold transition-colors font-sans"
                >
                  Lanjut <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-1.5">
                  {submitError && <p className="text-xs text-red-500 font-sans">{submitError}</p>}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold transition-colors font-sans disabled:opacity-60"
                  >
                    {submitting
                      ? <><Loader2 size={15} className="animate-spin" /> Mengirim...</>
                      : '✅ Kirim Konsultasi'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
