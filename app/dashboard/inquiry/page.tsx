'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Phone, Search, Loader2, Filter, GripVertical, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type Stage = 'baru' | 'dihubungi' | 'survey' | 'negosiasi' | 'deal' | 'gagal';

const STATIC_INQUIRIES = [
  { id: '1', name: 'Ahmad Fajar',  whatsapp: '081234567890', message: 'Pak, apakah masih tersedia? Bisa survey besok?', listing_title: 'Rumah Condongcatur', listing_code: 'HOL-0089', via: 'whatsapp', created_at: new Date(Date.now()-7200000).toISOString(),   stage: 'baru'      as Stage, photo: 'AF' },
  { id: '2', name: 'Siti Rahayu',  whatsapp: '081398765432', message: 'Berapa harga finalnya pak?',                      listing_title: 'Tanah Gamping',      listing_code: 'HOL-0094', via: 'whatsapp', created_at: new Date(Date.now()-18000000).toISOString(),  stage: 'negosiasi' as Stage, photo: 'SR' },
  { id: '3', name: 'Budi Santoso', whatsapp: '087812345678', message: 'Sertifikatnya SHM ya? Bisa kredit?',              listing_title: 'Villa Pakem',        listing_code: 'HOL-0102', via: 'direct',   created_at: new Date(Date.now()-86400000).toISOString(),  stage: 'dihubungi' as Stage, photo: 'BS' },
  { id: '4', name: 'Dewi Lestari', whatsapp: '085678901234', message: 'KPR-able tidak? Budget saya 1M',                  listing_title: 'Rumah Condongcatur', listing_code: 'HOL-0089', via: 'whatsapp', created_at: new Date(Date.now()-86400000).toISOString(),  stage: 'survey'    as Stage, photo: 'DL' },
  { id: '5', name: 'Farida Hanum', whatsapp: '089567890123', message: 'Deal! Kapan bisa tanda tangan?',                  listing_title: 'Ruko Mlati',         listing_code: 'HOL-0058', via: 'direct',   created_at: new Date(Date.now()-259200000).toISOString(), stage: 'deal'      as Stage, photo: 'FH' },
];

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: 'baru',      label: 'Baru',        color: 'bg-blue-100   text-blue-700   border-blue-200'     },
  { key: 'dihubungi', label: 'Dihubungi',   color: 'bg-amber-100  text-amber-700  border-amber-200'    },
  { key: 'survey',    label: 'Survey',      color: 'bg-purple-100 text-purple-700 border-purple-200'   },
  { key: 'negosiasi', label: 'Negosiasi',   color: 'bg-orange-100 text-orange-700 border-orange-200'   },
  { key: 'deal',      label: 'Deal ✅',     color: 'bg-emerald-100 text-emerald-700 border-emerald-200'},
  { key: 'gagal',     label: 'Tidak Jadi',  color: 'bg-gray-100   text-gray-500   border-gray-200'     },
];

const viaColors: Record<string, string> = {
  whatsapp: 'bg-[#dcfce7] text-[#16a34a]',
  direct:   'bg-[#dbeafe] text-[#1d4ed8]',
  email:    'bg-[#f3e8ff] text-[#7c3aed]',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Baru saja';
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function buildWaLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '');
  const number = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${number}`;
}

export default function InquiryPage() {
  const { getToken }                     = useAuth();
  const [view,         setView]          = useState<'list' | 'kanban'>('list');
  const [activeStage,  setActiveStage]   = useState<Stage | 'semua'>('semua');
  const [search,       setSearch]        = useState('');
  const [expandedId,   setExpandedId]    = useState<string | null>(null);
  const [noteInputs,   setNoteInputs]    = useState<Record<string, string>>({});
  const [allInquiries, setAllInquiries]  = useState<any[]>(STATIC_INQUIRIES);
  const [loading,      setLoading]       = useState(true);
  const [apiError,     setApiError]      = useState(false);
  const [updatingId,   setUpdatingId]    = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        if (!token) { setLoading(false); setApiError(true); return; }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const d = await res.json();
        if (d.ok && d.data?.inquiries?.length > 0) {
          setAllInquiries(d.data.inquiries.map((i: any) => ({
            ...i,
            photo: (i.name ?? '??').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
          })));
          setApiError(false);
        }
      } catch {
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStage = async (id: string, stage: Stage, notes?: string) => {
    // Optimistic update
    setAllInquiries(prev => prev.map(i => i.id === id ? { ...i, stage } : i));
    setUpdatingId(id);
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ stage, notes: notes ?? null }),
      });
    } catch {
      // revert on error
      setAllInquiries(prev => prev.map(i => i.id === id ? { ...i, stage: i.stage } : i));
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNote = async (id: string) => {
    const notes = noteInputs[id] ?? '';
    if (!notes.trim()) return;
    setUpdatingId(id);
    try {
      const token = await getToken();
      if (!token) return;
      const inq = allInquiries.find(i => i.id === id);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ stage: inq?.stage ?? 'baru', notes }),
      });
      setNoteInputs(prev => ({ ...prev, [id]: '' }));
    } catch {}
    finally { setUpdatingId(null); }
  };

  const filtered = allInquiries.filter(i => {
    if (activeStage !== 'semua' && i.stage !== activeStage) return false;
    const q = search.toLowerCase();
    if (q && !i.name?.toLowerCase().includes(q) && !(i.listing_title ?? '').toLowerCase().includes(q)) return false;
    return true;
  });

  const newCount = allInquiries.filter(i => i.stage === 'baru').length;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Inquiry & CRM</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            <strong className="text-[#1D4ED8]">{allInquiries.length}</strong> inquiry total
            {newCount > 0 && <> — <strong className="text-blue-600">{newCount}</strong> baru</>}
            {apiError && <span className="ml-2 text-amber-500 text-xs">(menampilkan data demo)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'text-slate-400'}`}
              title="Tampilan List"
            >
              <Filter size={15} />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'text-slate-400'}`}
              title="Tampilan Kanban"
            >
              <GripVertical size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Stage filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveStage('semua')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ${
            activeStage === 'semua'
              ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
              : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
          }`}
        >
          Semua ({allInquiries.length})
        </button>
        {STAGES.map(({ key, label }) => {
          const count = allInquiries.filter(i => i.stage === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveStage(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans border transition-all ${
                activeStage === key
                  ? 'bg-[#1E3A8A] text-[#BAE6FD] border-[#1E3A8A]'
                  : 'bg-white text-slate-600 border-[#BFDBFE] hover:border-[#1D4ED8]'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama atau listing..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-white font-sans text-[#1E3A8A] placeholder-slate-300"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-6">
          <Loader2 size={16} className="animate-spin text-[#1D4ED8]" />
          <span className="text-sm font-sans">Memuat inquiry...</span>
        </div>
      )}

      {/* LIST VIEW */}
      {!loading && view === 'list' && (
        <div className="space-y-3">
          {filtered.map(inq => {
            const stageInfo  = STAGES.find(s => s.key === inq.stage) ?? STAGES[0];
            const isExpanded = expandedId === inq.id;

            return (
              <div key={inq.id} className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer hover:bg-[#F8FAFF] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {inq.photo}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-[#1E3A8A] font-heading">{inq.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${stageInfo.color}`}>
                        {stageInfo.label}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${viaColors[inq.via] ?? 'bg-slate-100 text-slate-500'}`}>
                        via {inq.via}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans line-clamp-1 italic">
                      "{inq.message ?? ''}"
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[10px] text-[#1D4ED8] font-semibold font-sans">
                        {inq.listing_title ?? '–'}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        {inq.listing_code ?? ''}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans flex items-center gap-0.5">
                        <Clock size={9} /> {timeAgo(inq.created_at ?? new Date().toISOString())}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={buildWaLink(inq.whatsapp ?? '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-[#25D366] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#1DB954] transition-colors font-sans"
                    >
                      <MessageSquare size={11} /> WA
                    </a>
                    <a
                      href={`tel:${inq.whatsapp}`}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 border border-[#BFDBFE] text-slate-500 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors font-sans"
                    >
                      <Phone size={10} />
                    </a>
                  </div>
                </div>

                {/* Expanded: stage mover + notes */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#F1F5F9] space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-sans mb-2 font-medium">Pindahkan ke stage:</p>
                      <div className="flex gap-2 flex-wrap">
                        {STAGES.map(({ key, label, color }) => (
                          <button
                            key={key}
                            onClick={e => { e.stopPropagation(); updateStage(inq.id, key); }}
                            disabled={updatingId === inq.id}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all disabled:opacity-50 ${
                              inq.stage === key
                                ? color + ' ring-2 ring-offset-1 ring-[#1D4ED8]'
                                : 'bg-white text-slate-500 border-[#BFDBFE] hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
                            }`}
                          >
                            {updatingId === inq.id && inq.stage !== key
                              ? <Loader2 size={10} className="inline animate-spin" />
                              : label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tambah catatan internal..."
                        value={noteInputs[inq.id] ?? ''}
                        onChange={e => setNoteInputs(prev => ({ ...prev, [inq.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') saveNote(inq.id); }}
                        className="flex-1 px-3 py-1.5 border border-[#BFDBFE] rounded-lg text-xs focus:border-[#1D4ED8] focus:outline-none bg-[#F8FAFF] font-sans"
                      />
                      <button
                        onClick={() => saveNote(inq.id)}
                        disabled={!noteInputs[inq.id]?.trim() || updatingId === inq.id}
                        className="bg-[#1D4ED8] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#1E40AF] transition-colors font-sans flex items-center gap-1 disabled:opacity-40"
                      >
                        Simpan <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-400 font-sans bg-white rounded-xl border border-[#BFDBFE]">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-[#1E3A8A]">Tidak ada inquiry ditemukan</p>
              <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      )}

      {/* KANBAN VIEW */}
      {!loading && view === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGES.slice(0, 5).map(({ key, label, color }) => {
              const items = allInquiries.filter(i => i.stage === key);
              return (
                <div key={key} className="w-64 flex-shrink-0">
                  <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-xl border ${color}`}>
                    <span className="text-[11px] font-bold">{label}</span>
                    <span className="text-[10px] font-bold opacity-70">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(inq => (
                      <div
                        key={inq.id}
                        className="bg-white rounded-xl border border-[#BFDBFE] p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-[#BAE6FD] flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                            {inq.photo}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1E3A8A] font-heading truncate">{inq.name}</p>
                            <p className="text-[9px] text-slate-400 font-sans">{timeAgo(inq.created_at ?? new Date().toISOString())}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans line-clamp-2 mb-2 italic">
                          "{inq.message ?? ''}"
                        </p>
                        <p className="text-[9px] text-[#1D4ED8] font-semibold font-sans truncate mb-2">
                          {inq.listing_title ?? '–'}
                        </p>
                        <div className="flex gap-1.5">
                          <a
                            href={buildWaLink(inq.whatsapp ?? '')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center text-[9px] font-bold bg-[#25D366] text-white py-1.5 rounded-lg hover:bg-[#1DB954] transition-colors"
                          >
                            WA
                          </a>
                          <select
                            value={inq.stage}
                            onChange={e => updateStage(inq.id, e.target.value as Stage)}
                            className="flex-1 text-[9px] font-semibold border border-[#BFDBFE] text-slate-600 py-1 rounded-lg focus:outline-none focus:border-[#1D4ED8] bg-white cursor-pointer"
                          >
                            {STAGES.map(s => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="text-center py-6 text-slate-300 text-xs font-sans border-2 border-dashed border-[#F1F5F9] rounded-xl">
                        Kosong
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
