'use client';

import { useEffect, useState } from 'react';
import {
  Users, Home, DollarSign, MessageSquare,
  AlertTriangle, AlertCircle, CheckCircle2,
  ShieldAlert, FileWarning, CreditCard, Clock,
  Zap, Search, Bell, Loader2, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { getAdminStats, getAdminLeads } from '@/lib/api';

const alerts = [
  { level: 'yellow', icon: MessageSquare, text: 'Cek leads konsultasi baru', href: '/admin/laporan' },
  { level: 'yellow', icon: Clock,         text: 'Review listing pending dari agen', href: '/admin/listing' },
  { level: 'yellow', icon: AlertCircle,   text: 'Verifikasi user Tier 2 yang menunggu', href: '/admin/users' },
  { level: 'green',  icon: CheckCircle2,  text: 'Sistem berjalan normal', href: '/admin/pengaturan' },
];

const quickActions = [
  { label: '🚨 Moderasi Listing',   href: '/admin/listing',    urgent: true  },
  { label: '💬 Leads Konsultasi',   href: '/admin/laporan',    urgent: false },
  { label: '👥 Manajemen User',     href: '/admin/users',      urgent: false },
  { label: '📦 Paket & Transaksi',  href: '/admin/transaksi',  urgent: false },
];

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', maximumFractionDigits: 0 }).format(n);

export default function AdminDashboardPage() {
  const { getToken } = useAuth();

  const [stats,   setStats]   = useState<{ total_users: number; active_listings: number; new_leads: number; monthly_revenue: number } | null>(null);
  const [leads,   setLeads]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        if (!token) { setError('Token tidak tersedia'); setLoading(false); return; }

        const [statsData, leadsData] = await Promise.all([
          getAdminStats(token),
          getAdminLeads(token, 1),
        ]);

        setStats(statsData);
        setLeads((leadsData as any).leads ?? []);
      } catch (e: any) {
        setError(e.message ?? 'Gagal memuat data admin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = stats
    ? [
        { label: 'Total Users',        value: stats.total_users.toLocaleString('id-ID'),    sub: 'terdaftar',          icon: Users,       trend: '' },
        { label: 'Listing Aktif',       value: stats.active_listings.toLocaleString('id-ID'), sub: 'tayang saat ini',   icon: Home,        trend: '' },
        { label: 'Revenue Bulan Ini',   value: formatRupiah(stats.monthly_revenue),           sub: 'dari transaksi paid',icon: DollarSign, trend: '' },
        { label: 'Leads Baru',          value: stats.new_leads.toLocaleString('id-ID'),       sub: 'belum diproses',    icon: MessageSquare, trend: '' },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">Command Center</h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            {loading ? 'Memuat data...' : error ? `Error: ${error}` : 'Data real-time dari database'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert("🔔 Notifikasi Admin\n\n• 5 listing dilaporkan\n• 3 leads baru\n• 23 users pending Tier 2")} className="p-2 rounded-xl border border-[#BFDBFE] text-slate-500 hover:text-[#1D4ED8]">
            <Bell size={18} />
          </button>
          <button onClick={() => alert("Filter & cari di seluruh sistem admin.")} className="p-2 rounded-xl border border-[#BFDBFE] text-slate-500 hover:text-[#1D4ED8]">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Metrics */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={18} className="animate-spin text-[#1D4ED8]" />
          <span className="text-sm font-sans">Memuat statistik...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-sans">
          {error} — Pastikan Anda memiliki role admin dan Workers API sudah aktif.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(m => (
            <div key={m.label} className="bg-white border border-[#BFDBFE] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-sans">{m.label}</span>
                <m.icon size={16} className="text-[#1D4ED8] opacity-60" />
              </div>
              <p className="font-heading font-bold text-2xl text-[#1E3A8A]">{m.value}</p>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Alerts */}
        <div className="bg-white border border-[#BFDBFE] rounded-2xl p-5 space-y-3">
          <h2 className="font-heading font-bold text-[#1E3A8A]">Status Sistem</h2>
          {alerts.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F0F4FF] transition-colors group"
            >
              <a.icon
                size={15}
                className={`mt-0.5 flex-shrink-0 ${
                  a.level === 'red'    ? 'text-red-500' :
                  a.level === 'yellow' ? 'text-amber-500' : 'text-emerald-500'
                }`}
              />
              <span className="text-xs text-slate-600 font-sans group-hover:text-[#1D4ED8]">{a.text}</span>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#BFDBFE] rounded-2xl p-5 space-y-3">
          <h2 className="font-heading font-bold text-[#1E3A8A]">Aksi Cepat</h2>
          {quickActions.map(a => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium font-sans transition-colors ${
                a.urgent
                  ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                  : 'border border-[#BFDBFE] text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
              }`}
            >
              {a.label}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>

        {/* Leads terbaru */}
        <div className="bg-white border border-[#BFDBFE] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-[#1E3A8A]">Leads Terbaru</h2>
            <Link href="/admin/laporan" className="text-xs text-[#1D4ED8] hover:underline font-sans">
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm font-sans">
              <Loader2 size={14} className="animate-spin" /> Memuat...
            </div>
          ) : leads.length === 0 ? (
            <p className="text-sm text-slate-400 font-sans">Belum ada leads</p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead: any) => (
                <div key={lead.id} className="flex items-start justify-between gap-2 py-2 border-b border-[#EFF6FF] last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{lead.name}</p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {lead.property_type ?? '—'} · {lead.lokasi_incaran ?? 'lokasi fleksibel'}
                    </p>
                    {lead.budget_max && (
                      <p className="text-[11px] text-[#1D4ED8] font-sans">
                        Budget: {new Intl.NumberFormat('id-ID', { notation: 'compact', style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(lead.budget_max)}
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                    lead.status === 'baru'      ? 'bg-blue-50 text-blue-700' :
                    lead.status === 'diproses'  ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
