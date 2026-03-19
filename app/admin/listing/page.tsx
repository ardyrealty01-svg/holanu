'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Search, Filter, CheckCircle, XCircle, Flag, Eye,
  Edit, Trash2, ToggleLeft, Clock, AlertTriangle, Loader2,
} from 'lucide-react';

const INITIAL_LISTINGS = [
  { id: 'HOL-1203', code: 'HOL-1203', title: 'Rumah Condongcatur 3KT',   agent: 'Andi W.',   status: 'aktif',   flag: 'clean', views: 234, reported: 0 },
  { id: 'HOL-1204', code: 'HOL-1204', title: 'Tanah Mlati SHM 300m²',    agent: 'Budi S.',   status: 'pending', flag: 'clean', views: 12,  reported: 0 },
  { id: 'HOL-1205', code: 'HOL-1205', title: 'Kost Putri Dekat UGM',     agent: 'Citra K.',  status: 'reported',flag: 'warn',  views: 89,  reported: 3 },
  { id: 'HOL-1206', code: 'HOL-1206', title: 'Villa Mewah Pool Pakem',   agent: 'Dian P.',   status: 'aktif',   flag: 'clean', views: 890, reported: 0 },
  { id: 'HOL-1207', code: 'HOL-1207', title: 'Apartemen Studio UGM',     agent: 'Eka R.',    status: 'pending', flag: 'warn',  views: 5,   reported: 0 },
  { id: 'HOL-1208', code: 'HOL-1208', title: 'Gudang 500m² Jalan Raya',  agent: 'Fahmi N.',  status: 'aktif',   flag: 'clean', views: 67,  reported: 0 },
];

const statusBadge: Record<string, { label: string; cls: string }> = {
  aktif:    { label: '🟢 Aktif',    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  pending:  { label: '🟡 Pending',  cls: 'bg-amber-50   text-amber-700   border border-amber-200'   },
  reported: { label: '🔴 Reported', cls: 'bg-red-50     text-red-700     border border-red-200'     },
  expired:  { label: '⚫ Expired',  cls: 'bg-gray-100   text-gray-500    border border-gray-200'    },
};

export default function AdminListingPage() {
  const { getToken }  = useAuth();
  const [autoApprove, setAutoApprove] = useState(true);
  const [activeTab,   setActiveTab]   = useState('semua');
  const [listings,    setListings]    = useState(INITIAL_LISTINGS);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const tabs = ['semua', 'pending', 'reported', 'expired', 'featured'];

  const callAdminAPI = async (listingId: string, action: 'approve' | 'reject') => {
    setActioningId(listingId);
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings/${listingId}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.map(l =>
        l.id === listingId
          ? { ...l, status: action === 'approve' ? 'aktif' : 'draft' }
          : l
      ));
    } catch { alert('Gagal. Coba lagi.'); }
    finally { setActioningId(null); }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Hapus listing ini permanen?')) return;
    setActioningId(listingId);
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.filter(l => l.id !== listingId));
    } catch { alert('Gagal hapus. Coba lagi.'); }
    finally { setActioningId(null); }
  };

  const filtered = listings.filter(l => {
    if (activeTab === 'semua') return true;
    return l.status === activeTab;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Manajemen Listing</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">3.891 listing terdaftar</p>
        </div>
        {/* Auto-approve toggle */}
        <div className="flex items-center gap-3 bg-white border border-[#BFDBFE] rounded-xl px-4 py-2.5 shadow-sm">
          <div>
            <p className="text-xs font-bold text-[#1E3A8A] font-sans">Auto-approve</p>
            <p className="text-[10px] text-slate-400 font-sans">Delay: 10 menit</p>
          </div>
          <button
            onClick={() => setAutoApprove(v => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${autoApprove ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoApprove ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
          </button>
          <span className={`text-[10px] font-bold font-sans ${autoApprove ? 'text-emerald-600' : 'text-slate-400'}`}>
            {autoApprove ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans whitespace-nowrap transition-all capitalize ${
              activeTab === t
                ? 'bg-[#1E3A8A] text-[#BAE6FD]'
                : 'bg-white border border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8]'
            }`}
          >
            {t} {t === 'pending' && <span className="ml-1 bg-amber-400 text-white px-1 rounded text-[9px]">2</span>}
            {t === 'reported' && <span className="ml-1 bg-red-500 text-white px-1 rounded text-[9px]">1</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode atau judul listing..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-white font-sans placeholder-slate-300"
          />
        </div>
        <button onClick={() => alert("Gunakan tab status (semua/pending/reported) untuk filter listing.")} className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-sm text-slate-600 px-3 py-2.5 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFF6FF]">
              <tr>
                <th className="text-left px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 accent-[#1D4ED8]" /></th>
                {['Kode', 'Judul Listing', 'Agent', 'Status', 'AI Check', 'Views', 'Report', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {filtered.map(listing => {
                const badge = statusBadge[listing.status];
                return (
                  <tr key={listing.code} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 accent-[#1D4ED8]" /></td>
                    <td className="px-3 py-3 font-mono text-[10px] text-slate-400">{listing.code}</td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-[#1E3A8A] font-heading">{listing.title}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 font-sans">{listing.agent}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
                    </td>
                    <td className="px-3 py-3">
                      {listing.flag === 'clean' ? (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle size={11} /> Clean
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <AlertTriangle size={11} /> Warning
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs font-bold text-[#1E3A8A]">{listing.views}</td>
                    <td className="px-3 py-3">
                      {listing.reported > 0 ? (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                          <Flag size={10} /> {listing.reported}x
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => window.open(`/property/${listing.code}`, "_blank")} className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors" title="Preview">
                          <Eye size={12} />
                        </button>
                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => callAdminAPI(listing.id, 'approve')}
                              disabled={actioningId === listing.id}
                              className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                              title="Approve"
                            >
                              {actioningId === listing.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            </button>
                            <button
                              onClick={() => callAdminAPI(listing.id, 'reject')}
                              disabled={actioningId === listing.id}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                              title="Reject"
                            >
                              <XCircle size={12} />
                            </button>
                          </>
                        )}
                        <a
                          href={`/property/${listing.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Lihat listing"
                        >
                          <Edit size={12} />
                        </a>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={actioningId === listing.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-sans">Menampilkan {filtered.length} dari 3.891 listing</span>
          <div className="flex items-center gap-2">
            <button onClick={() => { if(confirm("Approve semua listing pending?")) { setListings(prev => prev.map(l => l.status === "pending" ? {...l, status: "aktif"} : l)); alert("✅ Semua listing pending diapprove."); } }} className="text-xs text-[#1D4ED8] font-bold border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans">
              Bulk Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
