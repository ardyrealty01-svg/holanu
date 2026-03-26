'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Upload, MapPin, X, Flame, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadToImageKit, validateImageFile } from '@/lib/imagekit';
import { createListing } from '@/lib/api';
import { useUser, useAuth } from '@clerk/nextjs';

type Step = 1 | 2 | 3 | 4 | 5;

interface PhotoItem {
  url:       string;   // ImageKit CDN URL
  thumbnail: string;
  name:      string;
  uploading: boolean;
  error?:    string;
}

const STEPS = [
  { n: 1, label: 'Tujuan & Harga'   },
  { n: 2, label: 'Lokasi'           },
  { n: 3, label: 'Jenis & Spesifikasi' },
  { n: 4, label: 'Media'            },
  { n: 5, label: 'Detail & Publish' },
];

const PROPERTY_TYPES = ['Rumah', 'Tanah', 'Kost', 'Hotel', 'Homestay', 'Villa', 'Ruko', 'Gudang', 'Lainnya'];
const PROVINCES     = ['DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'DKI Jakarta', 'Bali', 'Sumatera Utara', 'Sulawesi Selatan'];
const LEGALITAS_TANAH = [
  'SHM Pekarangan',
  'SHM Sawah',
  'SHM Tegalan',
  'SHGB Keturunan',
  'SHGB PT',
  'SHGB Sultan Ground',
  'PPJB / Girik / Letter C / Lainnya',
];
const FACILITIES    = ['Garasi', 'Carport', 'Kolam Renang', 'Taman', 'Keamanan 24 Jam', 'CCTV', 'Cluster One Gate', 'Dekat Tol', 'Dekat Sekolah', 'Mushola', 'Dapur', 'Ruang Tamu', 'Ruang Keluarga', 'Balkon'];

export default function TambahListingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [step, setStep]           = useState<Step>(1);
  const [offerType, setOfferType] = useState<string[]>(['Dijual']);
  const [propType, setPropType]   = useState('Rumah');
  const [currentPrice, setCurrentPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [sewaPrice, setSewaPrice]       = useState('');       // harga sewa (untuk Dijual & Disewa)
  const [rentPeriod, setRentPeriod]     = useState<'bulan' | 'tahun'>('bulan'); // /bulan atau /tahun
  const [nego, setNego]           = useState(false);
  const [province, setProvince]   = useState('');
  const [city, setCity]           = useState('');
  const [district, setDistrict]   = useState('');
  const [address, setAddress]     = useState('');
  const [bedrooms, setBedrooms]   = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [landArea, setLandArea]   = useState('');
  const [buildArea, setBuildArea] = useState('');
  const [certificate, setCertificate] = useState('');        // legalitas tanah
  const [imb, setImb]                 = useState<'ada' | 'tidak_ada' | ''>(''); // legalitas bangunan
  const [legalitasUsaha, setLegalitasUsaha] = useState<string[]>([]); // legalitas usaha
  const [condition, setCondition] = useState('Baru');
  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');
  const [sellReason, setSellReason] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [photos, setPhotos]       = useState<PhotoItem[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const hotActive = originalPrice !== '' && parseInt(originalPrice.replace(/\D/g,'')) > parseInt(currentPrice.replace(/\D/g,'') || '0');

  const handlePublish = async () => {
    if (!user?.id) { setPublishError('Kamu harus login terlebih dahulu'); return; }
    if (!title)    { setPublishError('Judul listing wajib diisi'); return; }
    if (!currentPrice) { setPublishError('Harga wajib diisi'); return; }
    // Jika Dijual & Disewa, harga sewa juga wajib
    const isDualOffer = offerType[0] === 'Dijual & Disewa';
    if (isDualOffer && !sewaPrice) { setPublishError('Harga sewa wajib diisi untuk listing Dijual & Disewa'); return; }

    setPublishing(true);
    setPublishError('');

    try {
      const token = await getToken();
      if (!token) { setPublishError('Sesi login tidak valid, silakan login ulang'); setPublishing(false); return; }

      const readyPhotos = photos.filter(p => !p.uploading).map(p => p.url);

      // user_id TIDAK dikirim dari frontend — diambil dari JWT di backend (lebih aman)
      const payload = {
        title:          title || `${propType} ${condition} di ${city || province}`,
        description:    description || null,
        sell_reason:    sellReason || null,
        price:          parseInt(currentPrice.replace(/\D/g,'')) || 0,
        original_price: originalPrice ? parseInt(originalPrice.replace(/\D/g,'')) : null,
        is_negotiable:  nego ? 1 : 0,
        // Untuk Dijual & Disewa: simpan harga sewa di sell_reason field sementara
        // atau kirim sebagai sewa_price + rent_period (backend akan simpan di notes)
        ...(isDualOffer && sewaPrice ? {
          sewa_price:  parseInt(sewaPrice.replace(/\D/g,'')) || 0,
          rent_period: rentPeriod,
        } : {}),
        // Untuk Disewa saja: simpan rent_period
        ...(!isDualOffer && offerType[0] === 'Disewa' ? {
          rent_period: rentPeriod,
        } : {}),
        province:       province || null,
        city:           city || null,
        district:       district || null,
        address:        address || null,
        property_type:  propType,
        offer_type:     offerType.join(' & '),
        bedrooms:       parseInt(bedrooms) || 0,
        bathrooms:      parseInt(bathrooms) || 0,
        land_area:      parseInt(landArea) || null,
        building_area:  parseInt(buildArea) || null,
        certificate:    certificate || null,
        // IMB/PBG dan legalitas usaha disimpan di doc_status (backend field tersedia)
        doc_status:     imb === 'ada' ? 'on_hand' : imb === 'tidak_ada' ? 'no_doc' : 'on_hand',
        // Legalitas usaha disimpan di description jika ada (sampai ada field khusus di schema)
        ...(legalitasUsaha.length > 0 ? {
          legalitas_usaha: legalitasUsaha,
        } : {}),
        condition:      condition,
        facilities:     facilities,
        images:         readyPhotos,
      };

      const result = await createListing(payload, token);
      router.push(`/dashboard/properti?success=${result.code}`);
    } catch (err: any) {
      setPublishError(err.message ?? 'Gagal publish. Coba lagi.');
    } finally {
      setPublishing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Dapatkan token sebelum upload
    const uploadToken = await getToken();
    if (!uploadToken) {
      setUploadError('Sesi login tidak valid. Silakan refresh halaman dan coba lagi.');
      return;
    }

    // Max 20 foto
    const remaining = 20 - photos.length;
    const toUpload  = files.slice(0, remaining);
    setUploadError('');

    for (const file of toUpload) {
      // Validasi
      const err = validateImageFile(file);
      if (err) { setUploadError(err); continue; }

      // Tambah placeholder uploading
      const tempId = `uploading-${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      setPhotos(prev => [...prev, {
        url: preview, thumbnail: preview,
        name: tempId, uploading: true,
      }]);

      try {
        const result = await uploadToImageKit(file, 'listings', undefined, uploadToken);
        // Replace placeholder dengan hasil upload
        setPhotos(prev => prev.map(p =>
          p.name === tempId
            ? { url: result.url, thumbnail: result.thumbnail, name: result.name, uploading: false }
            : p
        ));
        URL.revokeObjectURL(preview);
      } catch (err: any) {
        setPhotos(prev => prev.filter(p => p.name !== tempId));
        setUploadError(`Upload gagal: ${err.message}`);
      }
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleOffer = (v: string) => {
    setOfferType(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  const toggleFacility = (f: string) =>
    setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const formatRupiah = (val: string) => {
    const num = val.replace(/\D/g, '');
    return num ? parseInt(num).toLocaleString('id-ID') : '';
  };

  const savings = () => {
    const curr = parseInt(currentPrice.replace(/\D/g,'') || '0');
    const orig = parseInt(originalPrice.replace(/\D/g,'') || '0');
    if (orig > curr && curr > 0) return Math.round((1 - curr/orig) * 100);
    return 0;
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Tambah Properti Baru</h1>
        <p className="text-sm text-slate-500 font-sans mt-0.5">Lengkapi semua informasi agar listing mudah ditemukan</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto">
        {STEPS.map(({ n, label }, i) => (
          <div key={n} className="flex items-center flex-shrink-0">
            <button
              onClick={() => n < step && setStep(n as Step)}
              className="flex items-center gap-2"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                n < step  ? 'bg-[#1D4ED8] text-white' :
                n === step ? 'bg-[#1E3A8A] text-[#BAE6FD] ring-2 ring-[#1D4ED8] ring-offset-2' :
                'bg-[#F1F5F9] text-slate-400'
              }`}>
                {n < step ? '✓' : n}
              </div>
              <span className={`text-xs font-sans font-medium hidden sm:block ${
                n === step ? 'text-[#1E3A8A]' : n < step ? 'text-[#1D4ED8]' : 'text-slate-400'
              }`}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 mx-2 flex-shrink-0 transition-colors ${n < step ? 'bg-[#1D4ED8]' : 'bg-[#BFDBFE]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm p-6 sm:p-8">

        {/* ── STEP 1: Tujuan & Harga ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Tujuan & Harga Properti</h2>

            {/* Offer type */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Tujuan Iklan *</label>
              <div className="flex gap-2">
                {['Dijual', 'Disewa', 'Dijual & Disewa'].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setOfferType([v])}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold font-sans border transition-all ${
                      offerType.includes(v)
                        ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                        : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Harga Jual (tampil jika Dijual atau Dijual & Disewa) ── */}
            {(offerType[0] === 'Dijual' || offerType[0] === 'Dijual & Disewa') && (
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                  Harga Jual *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans font-semibold">Rp</span>
                  <input
                    type="text"
                    placeholder="850.000.000"
                    value={currentPrice}
                    onChange={e => setCurrentPrice(formatRupiah(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-500 font-sans cursor-pointer">
                    <input type="checkbox" checked={nego} onChange={e => setNego(e.target.checked)} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                    Bisa Nego
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-500 font-sans cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                    Nett (harga final)
                  </label>
                </div>
              </div>
            )}

            {/* ── Harga Sewa (tampil jika Disewa atau Dijual & Disewa) ── */}
            {(offerType[0] === 'Disewa' || offerType[0] === 'Dijual & Disewa') && (
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                  Harga Sewa *
                </label>
                <div className="flex gap-2">
                  {/* Input harga sewa */}
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans font-semibold">Rp</span>
                    <input
                      type="text"
                      placeholder={rentPeriod === 'bulan' ? '3.500.000' : '35.000.000'}
                      value={offerType[0] === 'Disewa' ? currentPrice : sewaPrice}
                      onChange={e => {
                        const val = formatRupiah(e.target.value);
                        offerType[0] === 'Disewa' ? setCurrentPrice(val) : setSewaPrice(val);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
                    />
                  </div>
                  {/* Toggle /bulan /tahun */}
                  <div className="flex border border-[#BFDBFE] rounded-xl overflow-hidden flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setRentPeriod('bulan')}
                      className={`px-3 py-2.5 text-xs font-semibold font-sans transition-colors ${
                        rentPeriod === 'bulan'
                          ? 'bg-[#1E3A8A] text-[#BAE6FD]'
                          : 'bg-white text-slate-500 hover:bg-[#EFF6FF]'
                      }`}
                    >
                      / bulan
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentPeriod('tahun')}
                      className={`px-3 py-2.5 text-xs font-semibold font-sans transition-colors border-l border-[#BFDBFE] ${
                        rentPeriod === 'tahun'
                          ? 'bg-[#1E3A8A] text-[#BAE6FD]'
                          : 'bg-white text-slate-500 hover:bg-[#EFF6FF]'
                      }`}
                    >
                      / tahun
                    </button>
                  </div>
                </div>
                {offerType[0] === 'Disewa' && (
                  <div className="flex items-center gap-3 mt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-500 font-sans cursor-pointer">
                      <input type="checkbox" checked={nego} onChange={e => setNego(e.target.checked)} className="w-3.5 h-3.5 accent-[#1D4ED8]" />
                      Bisa Nego
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Original price / HOT feature — hanya untuk properti Dijual */}
            {offerType[0] !== 'Disewa' && (
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                Harga Lama / Sebelumnya{' '}
                <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-sans font-semibold">Rp</span>
                <input
                  type="text"
                  placeholder="950.000.000"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(formatRupiah(e.target.value))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm text-[#1E3A8A] focus:outline-none bg-[#F8FAFF] font-sans transition-colors ${
                    hotActive ? 'border-red-300 focus:border-red-400' : 'border-[#BFDBFE] focus:border-[#1D4ED8]'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans flex items-center gap-1">
                <Info size={10} /> Isi jika harga pernah lebih tinggi — badge HOT aktif otomatis
              </p>

              {/* HOT preview */}
              {hotActive && (
                <div className="mt-3 flex items-center gap-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl px-4 py-3">
                  <Flame size={18} className="text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-700 font-sans">Badge HOT akan tampil otomatis di listing kamu!</p>
                    <p className="text-[10px] text-red-600 font-sans mt-0.5">
                      Harga turun{' '}
                      <strong>Hemat {savings()}%</strong>{' '}
                      — harga lama akan dicoret di card
                    </p>
                  </div>
                </div>
              )}
            </div>
            )} {/* end: offerType !== 'Disewa' */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Jenis Properti *</label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPropType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-all ${
                      propType === t
                        ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                        : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Lokasi ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Lokasi Properti</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Provinsi *</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
                >
                  <option value="">Pilih Provinsi</option>
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kab. / Kota *</label>
                <select
                  disabled={!province}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih Kab./Kota</option>
                  {province === 'DI Yogyakarta' && <>
                    <option>Kota Yogyakarta</option>
                    <option>Sleman</option>
                    <option>Bantul</option>
                    <option>Kulon Progo</option>
                    <option>Gunungkidul</option>
                  </>}
                  {province === 'Jawa Tengah' && <>
                    <option>Semarang</option>
                    <option>Solo</option>
                    <option>Magelang</option>
                  </>}
                  {province === 'Jawa Timur' && <>
                    <option>Surabaya</option>
                    <option>Malang</option>
                    <option>Sidoarjo</option>
                  </>}
                  {province === 'Jawa Barat' && <>
                    <option>Bandung</option>
                    <option>Bogor</option>
                    <option>Bekasi</option>
                  </>}
                  {province === 'DKI Jakarta' && <>
                    <option>Jakarta Selatan</option>
                    <option>Jakarta Barat</option>
                    <option>Jakarta Utara</option>
                    <option>Jakarta Timur</option>
                    <option>Jakarta Pusat</option>
                  </>}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kecamatan *</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Contoh: Depok, Mlati, Gamping..."
                  disabled={!city}
                  className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans disabled:opacity-40 placeholder-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kelurahan</label>
                <input
                  type="text"
                  placeholder="Contoh: Condongcatur"
                  disabled={!city}
                  className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans disabled:opacity-40 placeholder-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Alamat Lengkap</label>
              <textarea
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Jl. Colombo No. 12, Condongcatur, Sleman..."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300"
              />
            </div>

            {/* Map placeholder */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                Pin Lokasi di Peta{' '}
                <span className="text-slate-400 font-normal">(klik untuk set lokasi)</span>
              </label>
              <div className="w-full h-48 bg-[#1E40AF] rounded-xl flex flex-col items-center justify-center gap-2 border border-[#BFDBFE] cursor-pointer hover:bg-[#1E3A8A] transition-colors">
                <MapPin size={24} className="text-[#1D4ED8]" />
                <span className="text-sm text-[#94A3B8] font-sans">Klik untuk buka peta & set pin lokasi</span>
                <span className="text-[10px] text-[#64748B] font-sans">Mapbox GL JS akan dimuat di sini</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans">
                💡 Pin akan otomatis di-blur radius 200m untuk privasi. Pengguna melihat perkiraan lokasi.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3: Spesifikasi ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Spesifikasi {propType}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {propType !== 'Tanah' && propType !== 'Gudang' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kamar Tidur</label>
                    <input type="number" min={0} placeholder="3" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kamar Mandi</label>
                    <input type="number" min={0} placeholder="2" value={bathrooms} onChange={e => setBathrooms(e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Garasi / Carport</label>
                    <input type="number" min={0} placeholder="1" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Jumlah Lantai</label>
                    <input type="number" min={1} placeholder="2" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Luas Tanah (m²)</label>
                <input type="number" min={0} placeholder="120" value={landArea} onChange={e => setLandArea(e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
              </div>
              {propType !== 'Tanah' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Luas Bangunan (m²)</label>
                  <input type="number" min={0} placeholder="95" value={buildArea} onChange={e => setBuildArea(e.target.value)} className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Lebar Depan (m)</label>
                <input type="number" min={0} placeholder="8" className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF]" />
              </div>
            </div>

            {/* Legalitas */}
            <div className="space-y-5">
              <p className="text-xs font-semibold text-[#1E3A8A] font-sans">Legalitas</p>

              {/* ── Legalitas Tanah ── */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans mb-2.5">
                  Legalitas Tanah
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {LEGALITAS_TANAH.map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="cert"
                        value={c}
                        checked={certificate === c}
                        onChange={() => setCertificate(c)}
                        className="w-4 h-4 accent-[#1D4ED8] flex-shrink-0"
                      />
                      <span className={`text-sm font-sans transition-colors ${
                        certificate === c ? 'text-[#1D4ED8] font-semibold' : 'text-[#1E3A8A]'
                      }`}>
                        {c}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Legalitas Bangunan ── */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans mb-2.5">
                  Legalitas Bangunan
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1E3A8A] font-sans font-medium">IMB / PBG :</span>
                  <div className="flex gap-3 ml-1">
                    {(['ada', 'tidak_ada'] as const).map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imb"
                          value={v}
                          checked={imb === v}
                          onChange={() => setImb(v)}
                          className="w-4 h-4 accent-[#1D4ED8]"
                        />
                        <span className={`text-sm font-sans capitalize transition-colors ${
                          imb === v ? 'text-[#1D4ED8] font-semibold' : 'text-[#1E3A8A]'
                        }`}>
                          {v === 'ada' ? 'Ada' : 'Tidak Ada'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Legalitas Usaha (opsional) ── */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans mb-2.5">
                  Legalitas Usaha{' '}
                  <span className="text-slate-300 font-normal normal-case tracking-normal">(Opsional)</span>
                </p>
                <div className="space-y-2">
                  {['Izin Hotel', 'Izin Pemondokan', 'Lainnya'].map(u => (
                    <label key={u} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={legalitasUsaha.includes(u)}
                        onChange={e => {
                          setLegalitasUsaha(prev =>
                            e.target.checked ? [...prev, u] : prev.filter(x => x !== u)
                          );
                        }}
                        className="w-4 h-4 accent-[#1D4ED8] rounded flex-shrink-0"
                      />
                      <span className={`text-sm font-sans transition-colors ${
                        legalitasUsaha.includes(u) ? 'text-[#1D4ED8] font-semibold' : 'text-[#1E3A8A]'
                      }`}>
                        {u}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Kondisi */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Kondisi</label>
              <div className="flex gap-2">
                {['Baru', 'Bekas', 'Renovasi'].map(k => (
                  <button key={k} type="button"
                    onClick={() => setCondition(k)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans border transition-all ${
                      condition === k
                        ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                        : 'border-[#BFDBFE] text-slate-500 hover:border-[#1D4ED8]'
                    }`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-2 font-sans">Fasilitas</label>
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFacility(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-all ${
                      facilities.includes(f)
                        ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#1D4ED8]'
                        : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8]'
                    }`}
                  >
                    {facilities.includes(f) ? '✓ ' : ''}{f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Media ── */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Foto & Media</h2>

            {/* Photo upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1E3A8A] font-sans">
                  Foto Properti * <span className="text-slate-400 font-normal">(maks 20 foto, auto-konversi WebP)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-sans">{photos.filter(p => !p.uploading).length}/20</span>
              </div>

              {/* Error */}
              {uploadError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                  <X size={13} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600 font-sans">{uploadError}</p>
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {photos.map((photo, i) => (
                  <div key={photo.name} className="relative aspect-square rounded-xl overflow-hidden group bg-[#1E3A8A]">
                    <img src={photo.thumbnail} alt="" className="w-full h-full object-cover" />

                    {photo.uploading ? (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                        <Loader2 size={18} className="text-white animate-spin" />
                        <span className="text-[9px] text-white font-sans">Uploading...</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <button
                          onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                          className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {i === 0 && !photo.uploading && (
                      <span className="absolute bottom-1 left-1 text-[8px] bg-[#1D4ED8] text-white px-1.5 py-0.5 rounded font-bold">
                        Cover
                      </span>
                    )}
                    {!photo.uploading && (
                      <CheckCircle2 size={12} className="absolute top-1 right-1 text-emerald-400" />
                    )}
                  </div>
                ))}

                {photos.length < 20 && (
                  <label className="aspect-square border-2 border-dashed border-[#BFDBFE] rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#1D4ED8] hover:bg-[#EFF6FF] transition-all cursor-pointer">
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-sans text-center px-1">Klik upload</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-start gap-2 bg-[#EFF6FF] rounded-xl p-3 border border-[#BFDBFE]">
                <Info size={13} className="text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                <div className="text-[10px] text-slate-500 font-sans space-y-0.5">
                  <p>• Foto pertama akan jadi cover listing</p>
                  <p>• Semua foto <strong>otomatis dikonversi ke WebP</strong> untuk loading lebih cepat</p>
                  <p>• Format JPG, PNG, HEIC — maksimal 10MB per foto</p>
                  <p>• Minimal 3 foto untuk pengalaman terbaik</p>
                </div>
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                Link Video YouTube / TikTok{' '}
                <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
              />
            </div>

            {/* 360 */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                Link Virtual Tour 360°{' '}
                <span className="text-slate-400 font-normal">(Opsional — Matterport, dll)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
              />
            </div>
          </div>
        )}

        {/* ── STEP 5: Detail & Publish ── */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-heading font-semibold text-lg text-[#1E3A8A]">Deskripsi & Publikasi</h2>

            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Judul Listing *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Rumah Modern Minimalis 3KT SHM di Cluster Condongcatur Sleman"
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans placeholder-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">Deskripsi Properti *</label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Jelaskan keunggulan, keunikan, dan informasi penting tentang properti ini. Deskripsi yang lengkap akan lebih mudah ditemukan di pencarian."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-sans">Minimal 50 karakter untuk hasil SEO terbaik</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5 font-sans">
                Alasan Dijual / Disewa{' '}
                <span className="text-slate-400 font-normal">(Opsional — meningkatkan kepercayaan)</span>
              </label>
              <textarea
                rows={2}
                value={sellReason}
                onChange={e => setSellReason(e.target.value)}
                placeholder="Contoh: Pindah tugas ke luar kota, butuh dana cepat..."
                className="w-full px-3 py-2.5 border border-[#BFDBFE] rounded-xl text-sm text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans resize-none placeholder-slate-300"
              />
            </div>

            {/* Listing code preview */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1E3A8A] font-sans mb-1">Preview Kode Listing</p>
              <p className="font-mono text-sm text-[#1D4ED8] font-bold">HOL-YGY-25-XXXX</p>
              <p className="text-[10px] text-slate-400 font-sans mt-1">Kode unik otomatis dibuat saat listing dipublish</p>
            </div>

            {/* Moderation info */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-700 font-sans">Proses Moderasi Otomatis</p>
                <p className="text-[10px] text-blue-600 font-sans mt-0.5">
                  Listing akan otomatis aktif dalam 10 menit jika tidak ada konten yang perlu direview. Anda akan mendapat notifikasi WhatsApp saat listing sudah aktif.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F1F5F9]">
          <button
            onClick={() => step > 1 && setStep(s => (s - 1) as Step)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm font-semibold text-slate-600 hover:border-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-sans"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!user?.id) { alert('Harus login untuk menyimpan draft'); return; }
                try {
                  const token = await getToken();
                  if (!token) return;
                  const draftPrice = parseInt(currentPrice.replace(/\D/g,'')) || 1; // min 1 agar tidak 0
                  const payload = {
                    title:         title || `${propType} Draft di ${city || province || 'Indonesia'}`,
                    price:         draftPrice,
                    property_type: propType,
                    offer_type:    offerType.join(' & '),
                    province:      province || null,
                    city:          city || null,
                    status:        'draft',
                    images:        [],
                    facilities:    facilities,
                    // Sertakan data harga sewa & legalitas jika sudah diisi
                    ...(offerType[0] !== 'Dijual' && rentPeriod ? { rent_period: rentPeriod } : {}),
                    ...(sewaPrice ? { sewa_price: parseInt(sewaPrice.replace(/\D/g,'')) || 0 } : {}),
                    ...(certificate ? { certificate } : {}),
                    ...(imb ? { doc_status: imb === 'ada' ? 'on_hand' : 'no_doc' } : {}),
                  };
                  await createListing(payload, token);
                  alert('✅ Draft tersimpan! Bisa dilanjutkan kapan saja dari halaman Properti Saya.');
                } catch { alert('Gagal simpan draft. Coba lagi.'); }
              }}
              className="px-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm font-semibold text-slate-600 hover:border-[#1D4ED8] transition-colors font-sans"
            >
              💾 Simpan Draft
            </button>
            {step < 5 ? (
              <button
                onClick={() => setStep(s => (s + 1) as Step)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-sm font-bold transition-colors font-sans"
              >
                Lanjut <ChevronRight size={16} />
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {publishError && (
                  <p className="text-xs text-red-500 font-sans">{publishError}</p>
                )}
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-[#BAE6FD] rounded-xl text-sm font-bold transition-colors font-sans disabled:opacity-50"
                >
                  {publishing ? (
                    <><Loader2 size={15} className="animate-spin" /> Publishing...</>
                  ) : (
                    '🚀 Publish Sekarang'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
