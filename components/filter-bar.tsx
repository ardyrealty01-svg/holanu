'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, SlidersHorizontal, X, Check } from 'lucide-react';

interface PriceRange {
  label: string;
  short: string;
  min: number | null;
  max: number | null;
}

interface FilterState {
  offerType: 'dijual' | 'disewa';
  jenis: string[];
  harga: PriceRange | null;
  provinsi: string | null;
  kota: string | null;
  kecamatan: string | null;
}

const PROPERTY_TYPES = ['Rumah', 'Tanah', 'Kost', 'Hotel', 'Homestay', 'Villa', 'Gudang', 'Ruko', 'Lainnya'];

const PRICE_RANGES: PriceRange[] = [
  { label: '< Rp 1 Miliar', short: '< 1M', min: null, max: 1000000000 },
  { label: 'Rp 1M – 2M', short: '1M–2M', min: 1000000000, max: 2000000000 },
  { label: 'Rp 2M – 3M', short: '2M–3M', min: 2000000000, max: 3000000000 },
  { label: 'Rp 3M – 4M', short: '3M–4M', min: 3000000000, max: 4000000000 },
  { label: 'Rp 4M – 5M', short: '4M–5M', min: 4000000000, max: 5000000000 },
  { label: 'Rp 5M – 6M', short: '5M–6M', min: 5000000000, max: 6000000000 },
  { label: 'Rp 6M – 7M', short: '6M–7M', min: 6000000000, max: 7000000000 },
  { label: 'Rp 7M – 8M', short: '7M–8M', min: 7000000000, max: 8000000000 },
  { label: 'Rp 8M – 9M', short: '8M–9M', min: 8000000000, max: 9000000000 },
  { label: 'Rp 9M – 10M', short: '9M–10M', min: 9000000000, max: 10000000000 },
  { label: '> Rp 10 Miliar', short: '> 10M', min: 10000000000, max: null },
];

const MOCK_PROVINSI = [
  { id: 'jawa-timur', name: 'Jawa Timur' },
  { id: 'jawa-barat', name: 'Jawa Barat' },
  { id: 'jawa-tengah', name: 'Jawa Tengah' },
  { id: 'yogyakarta', name: 'D.I. Yogyakarta' },
  { id: 'sumatera-utara', name: 'Sumatera Utara' },
  { id: 'sumatera-barat', name: 'Sumatera Barat' },
  { id: 'bali', name: 'Bali' },
  { id: 'sulawesi-selatan', name: 'Sulawesi Selatan' },
];

const MOCK_KOTA: Record<string, Array<{ id: string; name: string }>> = {
  'jawa-timur': [
    { id: 'surabaya', name: 'Surabaya' },
    { id: 'sidoarjo', name: 'Sidoarjo' },
    { id: 'gresik', name: 'Gresik' },
  ],
  'yogyakarta': [
    { id: 'yogyakarta', name: 'Yogyakarta' },
    { id: 'sleman', name: 'Sleman' },
    { id: 'bantul', name: 'Bantul' },
  ],
  'jawa-barat': [
    { id: 'bandung', name: 'Bandung' },
    { id: 'bekasi', name: 'Bekasi' },
    { id: 'bogor', name: 'Bogor' },
  ],
};

const MOCK_KECAMATAN: Record<string, Array<{ id: string; name: string }>> = {
  'surabaya': [
    { id: 'surabaya-pusat', name: 'Surabaya Pusat' },
    { id: 'surabaya-timur', name: 'Surabaya Timur' },
  ],
  'yogyakarta': [
    { id: 'yogyakarta-kota', name: 'Yogyakarta Kota' },
    { id: 'mantrijeron', name: 'Mantrijeron' },
  ],
};

interface DropdownState {
  jenis: boolean;
  harga: boolean;
  provinsi: boolean;
  kota: boolean;
  kecamatan: boolean;
}

export function FilterBar() {
  const router = useRouter();
  const filterRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    offerType: 'dijual',
    jenis: [],
    harga: null,
    provinsi: null,
    kota: null,
    kecamatan: null,
  });

  const [openDropdowns, setOpenDropdowns] = useState<DropdownState>({
    jenis: false,
    harga: false,
    provinsi: false,
    kota: false,
    kecamatan: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advBedrooms,  setAdvBedrooms]  = useState<string>('');
  const [advBathrooms, setAdvBathrooms] = useState<string>('');
  const [advLandMin,   setAdvLandMin]   = useState<string>('');
  const [advLandMax,   setAdvLandMax]   = useState<string>('');
  const [advCert,      setAdvCert]      = useState<string>('');
  const [advCond,      setAdvCond]      = useState<string>('');

  const [searchInputs, setSearchInputs] = useState({
    provinsi: '',
    kota: '',
    kecamatan: '',
  });

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenDropdowns({ jenis: false, harga: false, provinsi: false, kota: false, kecamatan: false });
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdowns({ jenis: false, harga: false, provinsi: false, kota: false, kecamatan: false });
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = (key: keyof DropdownState) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
      // Auto-close other dropdowns
      jenis: key === 'jenis' ? !prev[key] : false,
      harga: key === 'harga' ? !prev[key] : false,
      provinsi: key === 'provinsi' ? !prev[key] : false,
      kota: key === 'kota' ? !prev[key] : false,
      kecamatan: key === 'kecamatan' ? !prev[key] : false,
    }));
  };

  const handleJenisChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jenis: prev.jenis.includes(type) ? prev.jenis.filter((t) => t !== type) : [...prev.jenis, type],
    }));
  };

  const handleProvinsiChange = (prov: string) => {
    setFilters((prev) => ({
      ...prev,
      provinsi: prov,
      kota: null,
      kecamatan: null,
    }));
    setSearchInputs((prev) => ({ ...prev, provinsi: '', kota: '', kecamatan: '' }));
    setOpenDropdowns((prev) => ({ ...prev, provinsi: false }));
  };

  const handleKotaChange = (kota: string) => {
    setFilters((prev) => ({
      ...prev,
      kota,
      kecamatan: null,
    }));
    setSearchInputs((prev) => ({ ...prev, kota: '', kecamatan: '' }));
    setOpenDropdowns((prev) => ({ ...prev, kota: false }));
  };

  const handleCari = () => {
    const params = new URLSearchParams();
    // Use param names that match /jual and /sewa page's useSearchParams
    if (filters.jenis.length > 0)     params.append('property_type', filters.jenis[0]); // primary type
    if (filters.harga?.min !== null && filters.harga?.min !== undefined)
      params.append('min_price', filters.harga.min.toString());
    if (filters.harga?.max !== null && filters.harga?.max !== undefined)
      params.append('max_price', filters.harga.max.toString());
    if (filters.provinsi) params.append('provinsi', filters.provinsi);
    if (filters.kota)     params.append('city',     filters.kota);
    if (filters.kecamatan) params.append('district', filters.kecamatan);

    const route = filters.offerType === 'dijual' ? '/jual' : '/sewa';
    router.push(`${route}?${params.toString()}`);
  };

  const filteredProvinsi = MOCK_PROVINSI.filter((p) =>
    p.name.toLowerCase().includes(searchInputs.provinsi.toLowerCase())
  );

  const kotaOptions = filters.provinsi ? MOCK_KOTA[filters.provinsi] || [] : [];
  const filteredKota = kotaOptions.filter((k) =>
    k.name.toLowerCase().includes(searchInputs.kota.toLowerCase())
  );

  const kecamatanOptions = filters.kota ? MOCK_KECAMATAN[filters.kota] || [] : [];
  const filteredKecamatan = kecamatanOptions.filter((k) =>
    k.name.toLowerCase().includes(searchInputs.kecamatan.toLowerCase())
  );

  const totalActiveFilters = [
    filters.jenis.length > 0 ? 1 : 0,
    filters.harga ? 1 : 0,
    filters.provinsi ? 1 : 0,
    filters.kota ? 1 : 0,
    filters.kecamatan ? 1 : 0,
  ].filter((x) => x).length;

  const jenisLabel =
    filters.jenis.length === 0 ? 'Semua Jenis' : filters.jenis.length === 1 ? filters.jenis[0] : `${filters.jenis[0]} +${filters.jenis.length - 1}`;

  const provinceName = MOCK_PROVINSI.find((p) => p.id === filters.provinsi)?.name || null;
  const cityName = kotaOptions.find((k) => k.id === filters.kota)?.name || null;

  return (
    <div ref={filterRef} className="space-y-4">
      {/* Tab Switcher */}
      <div className="inline-flex rounded-lg bg-[rgba(255,255,255,0.08)] p-1 gap-1">
        {['Dijual', 'Disewa'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilters((prev) => ({ ...prev, offerType: tab === 'Dijual' ? 'dijual' : 'disewa' }))}
            className={`px-6 py-2 text-sm font-sans transition-all duration-150 rounded-md ${
              (tab === 'Dijual' ? filters.offerType === 'dijual' : filters.offerType === 'disewa')
                ? 'bg-[#1D4ED8] text-white font-bold'
                : 'text-[rgba(29,78,216,0.6)] hover:text-[#1D4ED8]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex gap-2 items-center flex-wrap md:flex-nowrap mt-3">
        {/* Jenis Dropdown */}
        <div className="relative w-full md:w-auto flex-1 md:flex-none md:min-w-[170px]">
          <button
            onClick={() => toggleDropdown('jenis')}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150 text-xs font-medium font-sans cursor-pointer ${
              openDropdowns.jenis || filters.jenis.length > 0
                ? 'border-[#1D4ED8] bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
                : 'border-[rgba(29,78,216,0.25)] bg-[rgba(255,255,255,0.06)] text-[#EFF6FF] hover:border-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)]'
            }`}
          >
            <span className="truncate">{jenisLabel}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-150 ${openDropdowns.jenis ? 'rotate-180' : ''}`} />
          </button>

          {openDropdowns.jenis && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-[#BFDBFE] rounded-xl shadow-[0_8px_32px_rgba(13,27,42,0.18)] min-w-[180px] overflow-hidden">
              <div className="max-h-[280px] overflow-y-auto">
                {PROPERTY_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E3A8A] cursor-pointer hover:bg-[#FDF8F0] transition-colors duration-100"
                  >
                    <input
                      type="checkbox"
                      checked={filters.jenis.includes(type)}
                      onChange={() => handleJenisChange(type)}
                      className="w-3.5 h-3.5 rounded cursor-pointer"
                      style={{
                        accentColor: '#1D4ED8',
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Harga Dropdown */}
        <div className="relative w-full md:w-auto flex-1 md:flex-none md:min-w-[170px]">
          <button
            onClick={() => toggleDropdown('harga')}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150 text-xs font-medium font-sans cursor-pointer ${
              openDropdowns.harga || filters.harga
                ? 'border-[#1D4ED8] bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
                : 'border-[rgba(29,78,216,0.25)] bg-[rgba(255,255,255,0.06)] text-[#EFF6FF] hover:border-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)]'
            }`}
          >
            <span className="truncate">{filters.harga ? filters.harga.short : 'Semua Harga'}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-150 ${openDropdowns.harga ? 'rotate-180' : ''}`} />
          </button>

          {openDropdowns.harga && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-[#BFDBFE] rounded-xl shadow-[0_8px_32px_rgba(13,27,42,0.18)] min-w-[180px] overflow-hidden">
              <div className="max-h-[280px] overflow-y-auto">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.short}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E3A8A] cursor-pointer hover:bg-[#FDF8F0] transition-colors duration-100"
                  >
                    <input
                      type="radio"
                      name="harga"
                      checked={filters.harga === range}
                      onChange={() => {
                        setFilters((prev) => ({ ...prev, harga: range }));
                        setOpenDropdowns((prev) => ({ ...prev, harga: false }));
                      }}
                      className="w-3.5 h-3.5 rounded-full cursor-pointer"
                      style={{ accentColor: '#1D4ED8' }}
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Provinsi Dropdown */}
        <div className="relative w-full md:w-auto flex-1 md:flex-none md:min-w-[220px]">
          <button
            onClick={() => toggleDropdown('provinsi')}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150 text-xs font-medium font-sans cursor-pointer ${
              openDropdowns.provinsi || filters.provinsi
                ? 'border-[#1D4ED8] bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
                : 'border-[rgba(29,78,216,0.25)] bg-[rgba(255,255,255,0.06)] text-[#EFF6FF] hover:border-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)]'
            }`}
          >
            <span className="truncate">{provinceName || 'Provinsi'}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-150 ${openDropdowns.provinsi ? 'rotate-180' : ''}`} />
          </button>

          {openDropdowns.provinsi && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-[#BFDBFE] rounded-xl shadow-[0_8px_32px_rgba(13,27,42,0.18)] min-w-[220px] overflow-hidden">
              <input
                type="text"
                placeholder="Cari provinsi..."
                value={searchInputs.provinsi}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, provinsi: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border-b border-[#BFDBFE] outline-none focus:border-[#1D4ED8] bg-white text-[#1E3A8A] placeholder-[#9CA3AF] font-sans"
              />
              <div className="max-h-[240px] overflow-y-auto">
                {filteredProvinsi.map((prov) => (
                  <label
                    key={prov.id}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E3A8A] cursor-pointer hover:bg-[#FDF8F0] transition-colors duration-100"
                  >
                    <input
                      type="radio"
                      name="provinsi"
                      checked={filters.provinsi === prov.id}
                      onChange={() => handleProvinsiChange(prov.id)}
                      className="w-3.5 h-3.5 rounded-full cursor-pointer"
                      style={{ accentColor: '#1D4ED8' }}
                    />
                    {prov.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kab/Kota Dropdown */}
        <div className="relative w-full md:w-auto flex-1 md:flex-none md:min-w-[220px]">
          <button
            onClick={() => filters.provinsi && toggleDropdown('kota')}
            disabled={!filters.provinsi}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150 text-xs font-medium font-sans cursor-pointer ${
              !filters.provinsi ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              (openDropdowns.kota || filters.kota) && filters.provinsi
                ? 'border-[#1D4ED8] bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
                : 'border-[rgba(29,78,216,0.25)] bg-[rgba(255,255,255,0.06)] text-[#EFF6FF] hover:border-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)]'
            }`}
          >
            <span className="truncate">{cityName || 'Kab. / Kota'}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-150 ${openDropdowns.kota ? 'rotate-180' : ''}`} />
          </button>

          {openDropdowns.kota && filters.provinsi && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-[#BFDBFE] rounded-xl shadow-[0_8px_32px_rgba(13,27,42,0.18)] min-w-[220px] overflow-hidden">
              <input
                type="text"
                placeholder="Cari kab/kota..."
                value={searchInputs.kota}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, kota: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border-b border-[#BFDBFE] outline-none focus:border-[#1D4ED8] bg-white text-[#1E3A8A] placeholder-[#9CA3AF] font-sans"
              />
              <div className="max-h-[240px] overflow-y-auto">
                {filteredKota.map((kota) => (
                  <label
                    key={kota.id}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E3A8A] cursor-pointer hover:bg-[#FDF8F0] transition-colors duration-100"
                  >
                    <input
                      type="radio"
                      name="kota"
                      checked={filters.kota === kota.id}
                      onChange={() => handleKotaChange(kota.id)}
                      className="w-3.5 h-3.5 rounded-full cursor-pointer"
                      style={{ accentColor: '#1D4ED8' }}
                    />
                    {kota.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kecamatan Dropdown */}
        <div className="relative w-full md:w-auto flex-1 md:flex-none md:min-w-[200px]">
          <button
            onClick={() => filters.kota && toggleDropdown('kecamatan')}
            disabled={!filters.kota}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150 text-xs font-medium font-sans cursor-pointer ${
              !filters.kota ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              (openDropdowns.kecamatan || filters.kecamatan) && filters.kota
                ? 'border-[#1D4ED8] bg-[rgba(29,78,216,0.08)] text-[#1D4ED8]'
                : 'border-[rgba(29,78,216,0.25)] bg-[rgba(255,255,255,0.06)] text-[#EFF6FF] hover:border-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)]'
            }`}
          >
            <span className="truncate">{filters.kecamatan || 'Kecamatan'}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-150 ${openDropdowns.kecamatan ? 'rotate-180' : ''}`} />
          </button>

          {openDropdowns.kecamatan && filters.kota && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-[#BFDBFE] rounded-xl shadow-[0_8px_32px_rgba(13,27,42,0.18)] min-w-[200px] overflow-hidden">
              <input
                type="text"
                placeholder="Cari kecamatan..."
                value={searchInputs.kecamatan}
                onChange={(e) => setSearchInputs((prev) => ({ ...prev, kecamatan: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs border-b border-[#BFDBFE] outline-none focus:border-[#1D4ED8] bg-white text-[#1E3A8A] placeholder-[#9CA3AF] font-sans"
              />
              <div className="max-h-[240px] overflow-y-auto">
                {filteredKecamatan.map((kec) => (
                  <label
                    key={kec.id}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#1E3A8A] cursor-pointer hover:bg-[#FDF8F0] transition-colors duration-100"
                  >
                    <input
                      type="radio"
                      name="kecamatan"
                      checked={filters.kecamatan === kec.id}
                      onChange={() => {
                        setFilters((prev) => ({ ...prev, kecamatan: kec.id }));
                        setOpenDropdowns((prev) => ({ ...prev, kecamatan: false }));
                      }}
                      className="w-3.5 h-3.5 rounded-full cursor-pointer"
                      style={{ accentColor: '#1D4ED8' }}
                    />
                    {kec.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cari Button */}
        <button
          onClick={handleCari}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1D4ED8] text-white text-xs font-bold rounded-lg hover:bg-[#1E40AF] transition-colors duration-150 whitespace-nowrap flex-shrink-0 font-sans"
        >
          <Search size={14} />
          Cari Properti
        </button>

        {/* Filter Lanjutan Button */}
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className={`relative flex items-center gap-1.5 px-4 py-2.5 border text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex-shrink-0 font-sans ${
            showAdvanced
              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
              : 'border-[rgba(29,78,216,0.35)] text-[#1D4ED8] hover:bg-[rgba(29,78,216,0.08)] hover:border-[#1D4ED8]'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filter Lanjutan
          {totalActiveFilters > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#1D4ED8] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalActiveFilters}
            </span>
          )}
        </button>
      </div>

      {/* ── Advanced Filter Panel ── */}
      {showAdvanced && (
        <div className="bg-white border border-[#BFDBFE] rounded-2xl shadow-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1E3A8A] font-sans">Filter Lanjutan</p>
            <button
              onClick={() => setShowAdvanced(false)}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none"
            >✕</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Kamar tidur */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Min. Kamar Tidur</label>
              <select
                value={advBedrooms}
                onChange={e => setAdvBedrooms(e.target.value)}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              >
                <option value="">Semua</option>
                {['1','2','3','4','5+'].map(n => <option key={n} value={n}>{n} KT</option>)}
              </select>
            </div>

            {/* Kamar mandi */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Min. Kamar Mandi</label>
              <select
                value={advBathrooms}
                onChange={e => setAdvBathrooms(e.target.value)}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              >
                <option value="">Semua</option>
                {['1','2','3','4+'].map(n => <option key={n} value={n}>{n} KM</option>)}
              </select>
            </div>

            {/* Luas tanah min */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Luas Tanah Min (m²)</label>
              <input
                type="number"
                placeholder="cth: 60"
                value={advLandMin}
                onChange={e => setAdvLandMin(e.target.value)}
                min={0}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              />
            </div>

            {/* Luas tanah max */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Luas Tanah Max (m²)</label>
              <input
                type="number"
                placeholder="cth: 500"
                value={advLandMax}
                onChange={e => setAdvLandMax(e.target.value)}
                min={0}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              />
            </div>

            {/* Sertifikat */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Sertifikat</label>
              <select
                value={advCert}
                onChange={e => setAdvCert(e.target.value)}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              >
                <option value="">Semua</option>
                {['SHM','HGB','SHGB','Girik','AJB'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Kondisi */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1E3A8A] mb-1.5 font-sans">Kondisi</label>
              <select
                value={advCond}
                onChange={e => setAdvCond(e.target.value)}
                className="w-full px-2.5 py-2 border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
              >
                <option value="">Semua</option>
                {['Baru','Bekas','Renovasi'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#EFF6FF]">
            <button
              onClick={() => {
                setAdvBedrooms(''); setAdvBathrooms('');
                setAdvLandMin(''); setAdvLandMax('');
                setAdvCert(''); setAdvCond('');
              }}
              className="px-4 py-2 border border-[#BFDBFE] text-slate-500 rounded-xl text-xs font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors font-sans"
            >
              Reset Filter Lanjutan
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (filters.jenis.length > 0)     params.set('property_type', filters.jenis[0]);
                if (filters.harga?.min != null)   params.set('min_price', filters.harga.min.toString());
                if (filters.harga?.max != null)   params.set('max_price', filters.harga.max.toString());
                if (filters.provinsi)             params.set('provinsi', filters.provinsi);
                if (filters.kota)                 params.set('city', filters.kota);
                if (filters.kecamatan)            params.set('district', filters.kecamatan);
                if (advBedrooms)                  params.set('bedrooms', advBedrooms.replace('+',''));
                if (advBathrooms)                 params.set('bathrooms', advBathrooms.replace('+',''));
                if (advLandMin)                   params.set('land_min', advLandMin);
                if (advLandMax)                   params.set('land_max', advLandMax);
                if (advCert)                      params.set('certificate', advCert);
                if (advCond)                      params.set('condition', advCond);
                const route = filters.offerType === 'dijual' ? '/jual' : '/sewa';
                router.push(`${route}?${params.toString()}`);
                setShowAdvanced(false);
              }}
              className="flex items-center gap-2 px-5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-bold transition-colors font-sans"
            >
              <Search size={13} /> Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Active Chips */}
      {totalActiveFilters > 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          {filters.jenis.map((jenis) => (
            <div
              key={jenis}
              className="flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] border border-[rgba(29,78,216,0.3)] text-[#1D4ED8] text-[10px] font-semibold pl-2.5 pr-2 py-1 rounded-full cursor-pointer hover:bg-[rgba(29,78,216,0.22)] transition-colors duration-150 font-sans"
            >
              {jenis}
              <button
                onClick={() => handleJenisChange(jenis)}
                className="text-[#1D4ED8] opacity-60 hover:opacity-100 text-xs leading-none"
              >
                ✕
              </button>
            </div>
          ))}

          {filters.harga && (
            <div className="flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] border border-[rgba(29,78,216,0.3)] text-[#1D4ED8] text-[10px] font-semibold pl-2.5 pr-2 py-1 rounded-full cursor-pointer hover:bg-[rgba(29,78,216,0.22)] transition-colors duration-150 font-sans">
              {filters.harga.short}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, harga: null }))}
                className="text-[#1D4ED8] opacity-60 hover:opacity-100 text-xs leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {filters.provinsi && (
            <div className="flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] border border-[rgba(29,78,216,0.3)] text-[#1D4ED8] text-[10px] font-semibold pl-2.5 pr-2 py-1 rounded-full cursor-pointer hover:bg-[rgba(29,78,216,0.22)] transition-colors duration-150 font-sans">
              {provinceName}
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    provinsi: null,
                    kota: null,
                    kecamatan: null,
                  }))
                }
                className="text-[#1D4ED8] opacity-60 hover:opacity-100 text-xs leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {filters.kota && filters.provinsi && (
            <div className="flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] border border-[rgba(29,78,216,0.3)] text-[#1D4ED8] text-[10px] font-semibold pl-2.5 pr-2 py-1 rounded-full cursor-pointer hover:bg-[rgba(29,78,216,0.22)] transition-colors duration-150 font-sans">
              {cityName}
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    kota: null,
                    kecamatan: null,
                  }))
                }
                className="text-[#1D4ED8] opacity-60 hover:opacity-100 text-xs leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {filters.kecamatan && (
            <div className="flex items-center gap-1.5 bg-[rgba(29,78,216,0.12)] border border-[rgba(29,78,216,0.3)] text-[#1D4ED8] text-[10px] font-semibold pl-2.5 pr-2 py-1 rounded-full cursor-pointer hover:bg-[rgba(29,78,216,0.22)] transition-colors duration-150 font-sans">
              {filters.kecamatan}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, kecamatan: null }))}
                className="text-[#1D4ED8] opacity-60 hover:opacity-100 text-xs leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {totalActiveFilters >= 2 && (
            <button
              onClick={() =>
                setFilters({
                  offerType: 'dijual',
                  jenis: [],
                  harga: null,
                  provinsi: null,
                  kota: null,
                  kecamatan: null,
                })
              }
              className="text-[10px] text-[rgba(29,78,216,0.5)] hover:text-[#1D4ED8] cursor-pointer ml-1 transition-colors font-sans"
            >
              Reset Semua
            </button>
          )}
        </div>
      )}
    </div>
  );
}
