'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getAdminUsers, toggleUserBan, upgradeUserTier } from '@/lib/api';
import {
  Search, Filter, Download, Eye, Edit, User,
  Ban, ChevronUp, ShieldCheck, MoreVertical,
  Phone, MapPin, Clock,
  MessageCircle, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';

/* ─── DATA TYPES ─── */
type MainTab = 'semua' | 'leads' | 'pemilik';

/* ─── USER DATA ─── */
const users = [
  { id: 'U-1024', name: 'Andi Wijaya',    email: 'andi@email.com',   role: 'Agent',           displayRole: 'Agent',          tier: 2, listing: 12, status: 'aktif',   paket: 'Gold',     joined: '12/01/25' },
  { id: 'U-1025', name: 'Budi Santoso',   email: 'budi@email.com',   role: 'Pemilik Properti',displayRole: 'Agent',          tier: 1, listing: 3,  status: 'aktif',   paket: 'Starter',  joined: '14/01/25' },
  { id: 'U-1026', name: 'Citra Kusuma',   email: 'citra@email.com',  role: 'Calon Pembeli',   displayRole: 'Calon Pembeli',  tier: 1, listing: 0,  status: 'aktif',   paket: '-',        joined: '15/01/25' },
  { id: 'U-1027', name: 'Dian Pratiwi',   email: 'dian@email.com',   role: 'Agent',           displayRole: 'Agent',          tier: 3, listing: 45, status: 'banned',  paket: 'Platinum', joined: '03/01/25' },
  { id: 'U-1028', name: 'Eka Rahayu',     email: 'eka@email.com',    role: 'Pemilik Properti',displayRole: 'Agent',          tier: 2, listing: 5,  status: 'aktif',   paket: 'Pro',      joined: '20/01/25' },
  { id: 'U-1029', name: 'Fahmi Nugroho',  email: 'fahmi@email.com',  role: 'Agent',           displayRole: 'Agent',          tier: 1, listing: 1,  status: 'aktif',   paket: 'Starter',  joined: '22/01/25' },
  { id: 'U-1030', name: 'Gita Sari',      email: 'gita@email.com',   role: 'Calon Pembeli',   displayRole: 'Calon Pembeli',  tier: 1, listing: 0,  status: 'aktif',   paket: '-',        joined: '25/01/25' },
];

/* ─── BUYER LEADS DATA ─── */
const buyerLeads = [
  {
    id: 'BL-001', name: 'Ahmad Fajar',    wa: '0812-3456-7890', domisili: 'Sleman, DIY',
    tipe: 'Rumah',    tujuan: 'Hunian Pribadi', lokasiIncaran: 'Depok, Sleman',
    budgetMin: 400000000, budgetMax: 700000000,
    pembayaran: 'KPR', timeline: '1–3 bulan',
    pekerjaan: 'Karyawan Swasta', catatan: 'Dekat sekolah, cluster lebih bagus',
    status: 'baru', masuk: '17/03/25 09:32',
  },
  {
    id: 'BL-002', name: 'Siti Rahayu',    wa: '0813-9876-5432', domisili: 'Jakarta Selatan',
    tipe: 'Apartemen', tujuan: 'Investasi', lokasiIncaran: 'Kota Yogyakarta',
    budgetMin: 300000000, budgetMax: 500000000,
    pembayaran: 'Cash', timeline: '3–6 bulan',
    pekerjaan: 'Wiraswasta', catatan: 'Lokasi strategis, dekat kampus UGM',
    status: 'diproses', masuk: '16/03/25 14:20',
  },
  {
    id: 'BL-003', name: 'Budi Prasetyo',  wa: '0878-1234-5678', domisili: 'Surabaya',
    tipe: 'Villa',    tujuan: 'Investasi', lokasiIncaran: 'Sleman Utara, Pakem',
    budgetMin: 2000000000, budgetMax: 5000000000,
    pembayaran: 'Cash Bertahap', timeline: '6–12 bulan',
    pekerjaan: 'Wiraswasta', catatan: 'Pemandangan sawah atau gunung, minimal 4KT',
    status: 'baru', masuk: '15/03/25 11:05',
  },
  {
    id: 'BL-004', name: 'Dewi Lestari',   wa: '0856-7890-1234', domisili: 'Bandung',
    tipe: 'Tanah',    tujuan: 'Investasi', lokasiIncaran: 'Gamping, Sleman',
    budgetMin: 500000000, budgetMax: 1000000000,
    pembayaran: 'Cash', timeline: 'Secepatnya',
    pekerjaan: 'PNS / BUMN', catatan: 'SHM, dekat tol, untuk bangun kost',
    status: 'selesai', masuk: '14/03/25 16:48',
  },
  {
    id: 'BL-005', name: 'Eko Santoso',    wa: '0821-4567-8901', domisili: 'Yogyakarta',
    tipe: 'Rumah',    tujuan: 'Hunian Pribadi', lokasiIncaran: 'Mlati atau Gamping',
    budgetMin: 300000000, budgetMax: 500000000,
    pembayaran: 'KPR', timeline: '1–3 bulan',
    pekerjaan: 'Karyawan Swasta', catatan: 'Butuh 3KT, garasi minimal 1 mobil',
    status: 'baru', masuk: '17/03/25 08:15',
  },
];

/* ─── PEMILIK DATA ─── */
const ownerData = [
  {
    id: 'OW-001', name: 'Rudi Hermawan',   wa: '0895-6789-0123', domisili: 'Sleman, DIY',
    tipeProperti: 'Rumah', harga: 850000000,
    lokasiProperti: 'Condongcatur, Depok, Sleman', listingCode: 'HOL-YGY-25-0089',
    statusListing: 'aktif', masuk: '10/03/25',
  },
  {
    id: 'OW-002', name: 'Farida Hanum',    wa: '0812-1111-2222', domisili: 'Kota Yogyakarta',
    tipeProperti: 'Tanah',  harga: 600000000,
    lokasiProperti: 'Gamping, Sleman', listingCode: 'HOL-YGY-25-0094',
    statusListing: 'aktif', masuk: '12/03/25',
  },
  {
    id: 'OW-003', name: 'Budi Santoso',    wa: '0813-3333-4444', domisili: 'Sleman, DIY',
    tipeProperti: 'Villa',  harga: 3500000000,
    lokasiProperti: 'Pakem, Sleman', listingCode: 'HOL-YGY-25-0102',
    statusListing: 'aktif', masuk: '08/03/25',
  },
  {
    id: 'OW-004', name: 'Eka Rahayu',      wa: '0878-5555-6666', domisili: 'Bantul, DIY',
    tipeProperti: 'Kost',   harga: 1800000000,
    lokasiProperti: 'Mlati, Sleman', listingCode: 'HOL-YGY-25-0091',
    statusListing: 'pending', masuk: '17/03/25',
  },
];

/* ─── HELPERS ─── */
const tierBadge: Record<number, string> = {
  1: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  2: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  3: 'bg-blue-50 text-blue-700 border border-blue-200',
};
const tierLabel: Record<number, string> = { 1: '🟡 Tier 1', 2: '🟢 Tier 2', 3: '🔵 Tier 3' };
const statusBadgeUser: Record<string, string> = {
  aktif:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  banned:  'bg-red-50 text-red-700 border border-red-200',
};
const leadStatusStyle: Record<string, { cls: string; label: string }> = {
  baru:      { cls: 'bg-blue-50 text-blue-700 border border-blue-200',      label: '🔵 Baru'      },
  diproses:  { cls: 'bg-amber-50 text-amber-700 border border-amber-200',   label: '🟡 Diproses'  },
  selesai:   { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: '🟢 Selesai' },
};
const fmtRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', maximumFractionDigits: 0 }).format(n);

/* ─── COMPONENT ─── */
export default function AdminUsersPage() {
  const { getToken }  = useAuth();
  const [mainTab, setMainTab] = useState<MainTab>('semua');
  const [search, setSearch]   = useState('');
  const [selectedLead, setSelectedLead] = useState<typeof buyerLeads[0] | null>(null);
  const [allUsers, setAllUsers]         = useState(users);
  const [loadingData, setLoadingData]   = useState(true);
  const [actioningId, setActioningId]   = useState<string | null>(null);

  // Load users dari real API saat mount
  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await getAdminUsers(token, 100);
        if (res.users?.length > 0) {
          setAllUsers(res.users.map((u: any) => ({
            id:          u.id,
            name:        u.name || 'Nama Pengguna',
            email:       u.email,
            role:        u.role || 'Calon Pembeli',
            displayRole: u.role === 'Pemilik Properti' ? 'Agent' : (u.role || 'Calon Pembeli'),
            tier:        u.tier || 1,
            listing:     u._count?.listings ?? 0,
            status:      u.is_banned ? 'banned' : 'aktif',
            paket:       u.paket || '-',
            joined:      u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-',
          })));
        }
      } catch {
        // Fallback ke data statis
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  const handleBanToggle = async (userId: string, currentlyBanned: boolean) => {
    setActioningId(userId);
    try {
      const token = await getToken();
      if (!token) return;
      const action = currentlyBanned ? 'unban' : 'ban';
      await toggleUserBan(userId, action, token);
      setAllUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: currentlyBanned ? 'aktif' : 'banned' } : u
      ));
    } catch { alert('Gagal. Coba lagi.'); }
    finally { setActioningId(null); }
  };

  const filteredUsers = allUsers.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.includes(search)) return false;
    return true;
  });

  const filteredLeads = buyerLeads.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.wa.includes(search)
  );

  const newLeadsCount = buyerLeads.filter(l => l.status === 'baru').length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Manajemen Users & Leads</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            Total {allUsers.length} user · {newLeadsCount} lead baru hari ini
          </p>
        </div>
        <button className="flex items-center gap-2 border border-[#BFDBFE] bg-white text-sm text-slate-600 px-4 py-2 rounded-xl font-sans hover:border-[#1D4ED8] transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 bg-white border border-[#BFDBFE] rounded-xl p-1 w-fit">
        {([
          { key: 'semua', label: 'Semua User' },
          { key: 'leads', label: `📋 Leads Buyer${newLeadsCount > 0 ? ` (${newLeadsCount} baru)` : ''}` },
          { key: 'pemilik', label: '🏠 Data Pemilik' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setMainTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-all ${
              mainTab === t.key ? 'bg-[#1E3A8A] text-[#BAE6FD]' : 'text-slate-500 hover:text-[#1E3A8A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={mainTab === 'leads' ? 'Cari nama atau WhatsApp...' : 'Cari nama, email...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-[#BFDBFE] rounded-xl text-sm focus:border-[#1D4ED8] focus:outline-none bg-white font-sans placeholder-slate-300"
        />
      </div>

      {/* ═══ TAB: SEMUA USER ═══ */}
      {mainTab === 'semua' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          {loadingData && (
            <div className="flex items-center gap-2 px-5 py-3 bg-[#EFF6FF] border-b border-[#BFDBFE]">
              <Loader2 size={14} className="animate-spin text-[#1D4ED8]" />
              <span className="text-xs text-[#1D4ED8] font-sans">Memuat data user dari database...</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#EFF6FF]">
                <tr>
                  <th className="text-left px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 accent-[#1D4ED8]" /></th>
                  {['ID', 'Nama / Email', 'Role Asli', 'Tier', 'Listing', 'Paket', 'Status', 'Bergabung', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="w-3.5 h-3.5 accent-[#1D4ED8]" /></td>
                    <td className="px-3 py-3 font-mono text-[10px] text-slate-400">{user.id}</td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-[#1E3A8A] font-heading">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{user.email}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] font-bold text-[#1E3A8A] font-sans block">{user.role}</span>
                      {user.role === 'Pemilik Properti' && (
                        <span className="text-[9px] text-slate-400 font-sans">tampil publik: Agent</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tierBadge[user.tier]}`}>
                        {tierLabel[user.tier]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs font-bold text-[#1E3A8A]">{user.listing}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-[#1D4ED8]">{user.paket}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded capitalize ${statusBadgeUser[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-slate-400 font-sans">{user.joined}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => alert(`User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nTier: ${user.tier}\nPaket: ${user.paket}\nStatus: ${user.status}\nJoined: ${user.joined}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                          title="Detail user"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => alert(`Untuk edit user ${user.name}, gunakan Clerk Dashboard:\nhttps://dashboard.clerk.com\n\nAtau update via API:\nPATCH /api/users/${user.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Edit user"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={async () => {
                            const newTier = user.tier + 1;
                            if (newTier > 3) { alert('Tier sudah maksimal (3)'); return; }
                            if (!confirm(`Upgrade tier ${user.name} dari Tier ${user.tier} ke Tier ${newTier}?`)) return;
                            setActioningId(user.id);
                            try {
                              const token = await getToken();
                              if (!token) return;
                              await upgradeUserTier(user.id, newTier, token);
                              setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, tier: newTier } : u));
                            } catch { alert('Gagal upgrade tier.'); }
                            finally { setActioningId(null); }
                          }}
                          disabled={user.tier >= 3 || actioningId === user.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-30"
                          title={`Upgrade ke Tier ${user.tier + 1}`}
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          onClick={() => handleBanToggle(user.id, user.status === 'banned')}
                          disabled={actioningId === user.id}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                            user.status === 'banned'
                              ? 'text-emerald-500 hover:bg-emerald-50'
                              : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                        >
                          {actioningId === user.id
                            ? <Loader2 size={13} className="animate-spin" />
                            : <Ban size={13} />}
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><MoreVertical size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
            <span className="text-xs text-slate-400 font-sans">Menampilkan {filteredUsers.length} dari {allUsers.length} users</span>
          </div>
        </div>
      )}

      {/* ═══ TAB: LEADS BUYER ═══ */}
      {mainTab === 'leads' && (
        <div className="space-y-3">

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Lead',   value: buyerLeads.length,                                    color: 'text-[#1E3A8A]' },
              { label: 'Lead Baru',    value: buyerLeads.filter(l => l.status === 'baru').length,    color: 'text-blue-600'   },
              { label: 'Diproses',     value: buyerLeads.filter(l => l.status === 'diproses').length,color: 'text-amber-600'  },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-[#BFDBFE] p-3 shadow-sm text-center">
                <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Leads table */}
          <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-[#1E3A8A]">Database Calon Pembeli</h2>
              <button className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans">
                <Download size={12} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#EFF6FF]">
                  <tr>
                    {['ID', 'Nama', 'WhatsApp', 'Domisili', 'Cari', 'Budget Maks', 'Pembayaran', 'Timeline', 'Status', 'Masuk', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {filteredLeads.map(lead => {
                    const st = leadStatusStyle[lead.status];
                    return (
                      <tr key={lead.id} className="hover:bg-[#F8FAFF] transition-colors">
                        <td className="px-3 py-3 font-mono text-[9px] text-slate-400">{lead.id}</td>
                        <td className="px-3 py-3 text-xs font-semibold text-[#1E3A8A] font-heading whitespace-nowrap">{lead.name}</td>
                        <td className="px-3 py-3 font-mono text-[10px] text-slate-500">{lead.wa}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 font-sans whitespace-nowrap">{lead.domisili}</td>
                        <td className="px-3 py-3">
                          <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded">{lead.tipe}</span>
                          <p className="text-[9px] text-slate-400 font-sans mt-0.5">{lead.lokasiIncaran}</p>
                        </td>
                        <td className="px-3 py-3 text-xs font-bold text-[#1D4ED8]">{fmtRp(lead.budgetMax)}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 font-sans whitespace-nowrap">{lead.pembayaran}</td>
                        <td className="px-3 py-3 text-[10px] text-slate-500 font-sans whitespace-nowrap">{lead.timeline}</td>
                        <td className="px-3 py-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-3 py-3 text-[9px] text-slate-400 font-sans whitespace-nowrap">{lead.masuk}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#DBEAFE] transition-colors"
                              title="Detail Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <a
                              href={`https://wa.me/62${lead.wa.replace(/\D/g,'').slice(1)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                              title="Hubungi via WA"
                            >
                              <MessageCircle size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: DATA PEMILIK ═══ */}
      {mainTab === 'pemilik' && (
        <div className="bg-white rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[#1E3A8A]">Database Pemilik Properti</h2>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] border border-[rgba(29,78,216,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#DBEAFE] transition-colors font-sans">
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#EFF6FF]">
                <tr>
                  {['ID', 'Nama', 'WhatsApp', 'Domisili', 'Jenis Properti', 'Harga', 'Lokasi Properti', 'Kode Listing', 'Status', 'Bergabung'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {ownerData.map(owner => (
                  <tr key={owner.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="px-3 py-3 font-mono text-[9px] text-slate-400">{owner.id}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-[#1E3A8A] font-heading whitespace-nowrap">{owner.name}</td>
                    <td className="px-3 py-3 font-mono text-[10px] text-slate-500">{owner.wa}</td>
                    <td className="px-3 py-3 text-[10px] text-slate-500 font-sans">{owner.domisili}</td>
                    <td className="px-3 py-3">
                      <span className="text-[9px] font-bold bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded">{owner.tipeProperti}</span>
                    </td>
                    <td className="px-3 py-3 text-xs font-bold text-[#1D4ED8]">{fmtRp(owner.harga)}</td>
                    <td className="px-3 py-3 text-[10px] text-slate-500 font-sans">{owner.lokasiProperti}</td>
                    <td className="px-3 py-3 font-mono text-[9px] text-[#1D4ED8]">{owner.listingCode}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        owner.statusListing === 'aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {owner.statusListing}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-slate-400 font-sans">{owner.masuk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9]">
            <span className="text-xs text-slate-400 font-sans">Total {ownerData.length} pemilik properti terdaftar</span>
          </div>
        </div>
      )}

      {/* ═══ MODAL: DETAIL LEAD ═══ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#BFDBFE]">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">Detail Lead</h2>
                <p className="text-[10px] text-slate-400 font-mono">{selectedLead.id}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg text-slate-400 hover:bg-[#EFF6FF]">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Identity */}
              <div className="bg-[#EFF6FF] rounded-xl p-4">
                <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider font-sans mb-3">Identitas</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: User,    label: 'Nama',      value: selectedLead.name       },
                    { icon: Phone,   label: 'WhatsApp',  value: selectedLead.wa         },
                    { icon: MapPin,  label: 'Domisili',  value: selectedLead.domisili   },
                    { icon: null,    label: 'Pekerjaan', value: selectedLead.pekerjaan  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] text-slate-400 font-sans uppercase tracking-wide">{label}</p>
                      <p className="text-xs font-semibold text-[#1E3A8A] font-sans mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property need */}
              <div className="bg-[#EFF6FF] rounded-xl p-4">
                <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider font-sans mb-3">Kebutuhan Properti</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tipe',        value: selectedLead.tipe         },
                    { label: 'Tujuan',      value: selectedLead.tujuan       },
                    { label: 'Lokasi Incaran', value: selectedLead.lokasiIncaran },
                    { label: 'Pembayaran',  value: selectedLead.pembayaran   },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] text-slate-400 font-sans uppercase tracking-wide">{label}</p>
                      <p className="text-xs font-semibold text-[#1E3A8A] font-sans mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial */}
              <div className="bg-[#EFF6FF] rounded-xl p-4">
                <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider font-sans mb-3">Finansial & Timeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] text-slate-400 font-sans uppercase tracking-wide">Budget</p>
                    <p className="text-xs font-bold text-[#1D4ED8] mt-0.5">{fmtRp(selectedLead.budgetMin)} – {fmtRp(selectedLead.budgetMax)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-sans uppercase tracking-wide">Timeline</p>
                    <p className="text-xs font-semibold text-[#1E3A8A] font-sans mt-0.5">{selectedLead.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Catatan */}
              {selectedLead.catatan && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider font-sans mb-1">Catatan Khusus</p>
                  <p className="text-xs text-amber-700 font-sans">{selectedLead.catatan}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <a
                  href={`https://wa.me/62${selectedLead.wa.replace(/\D/g,'').slice(1)}?text=${encodeURIComponent(`Halo ${selectedLead.name}, saya dari tim HOLANU. Kami telah menerima permintaan konsultasi properti Anda. Mari kami bantu menemukan ${selectedLead.tipe} di ${selectedLead.lokasiIncaran} sesuai budget Anda.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DB954] text-white font-bold text-sm py-3 rounded-xl transition-colors font-sans"
                >
                  <MessageCircle size={15} /> Hubungi via WA
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 border border-[#BFDBFE] text-slate-600 font-semibold text-sm py-3 rounded-xl hover:bg-[#EFF6FF] transition-colors font-sans"
                >
                  Tutup
                </button>
              </div>

              {/* Status update */}
              <div className="border-t border-[#F1F5F9] pt-3">
                <p className="text-[10px] text-slate-400 font-sans mb-2">Update status lead:</p>
                <div className="flex gap-2">
                  {Object.entries(leadStatusStyle).map(([key, { label, cls }]) => (
                    <button key={key} className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border transition-all ${cls} ${selectedLead.status === key ? 'ring-2 ring-offset-1 ring-[#1D4ED8]' : 'opacity-60 hover:opacity-100'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
