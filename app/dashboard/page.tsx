'use client';

import { useEffect, useState } from 'react';
import {
  Home, Eye, MessageSquare, TrendingUp,
  Clock, Zap, ArrowRight, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { getListings, listingToProperty, syncUser } from '@/lib/api';

export default function DashboardPage() {
  const { user, isLoaded }   = useUser();
  const { getToken }         = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const init = async () => {
      try {
        // 1. Sinkronisasi user Clerk ke database D1
        const token = await getToken();
        if (token) {
          await syncUser(token, {
            name:  user.fullName ?? user.username ?? undefined,
            email: user.primaryEmailAddress?.emailAddress ?? undefined,
            role:  'owner',
          }).catch(() => {}); // silent fail jika sudah ada
        }

        // 2. Ambil listing milik user ini saja
        const res = await getListings({ user_id: user.id, limit: 5 });
        setListings(res.listings.map(listingToProperty));
      } catch {
        // API belum tersedia, tampilkan state kosong
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isLoaded, user]);

  const firstName = user?.firstName ?? user?.username ?? 'Agen';

  const totalViews   = listings.reduce((s, l) => s + (l.views ?? 0), 0);
  const totalInquiry = listings.reduce((s, l) => s + (l.inquiry_count ?? 0), 0);

  const stats = [
    { label: 'Listing Aktif',     value: listings.length.toString(), sub: 'properti tayang', icon: Home,          up: true  },
    { label: 'Total Views',       value: totalViews.toLocaleString('id-ID'), sub: 'kumulatif', icon: Eye,          up: true  },
    { label: 'Inquiry Masuk',     value: totalInquiry.toString(), sub: 'dari semua listing', icon: MessageSquare, up: totalInquiry > 0 },
    { label: 'Konversi',          value: listings.length && totalViews ? `${((totalInquiry / totalViews) * 100).toFixed(1)}%` : '—', sub: 'inquiry / views', icon: TrendingUp, up: false },
  ];

  const quickActions = [
    { label: '+ Tambah Listing Baru', href: '/dashboard/properti/tambah', urgent: true  },
    { label: '💬 Inquiry Masuk',       href: '/dashboard/inquiry',         urgent: false },
    { label: '📊 Lihat Analitik',      href: '/dashboard/analitik',        urgent: false },
    { label: '⚙️ Pengaturan Profil',   href: '/dashboard/profil',          urgent: false },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#1E3A8A]">
            {isLoaded ? `Halo, ${firstName}! 👋` : 'Selamat datang! 👋'}
          </h1>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            {loading
              ? 'Memuat data dashboard...'
              : listings.length > 0
                ? `Kamu punya ${listings.length} listing aktif`
                : 'Belum ada listing — mulai tambah properti pertamamu!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/properti/tambah"
            className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors font-sans"
          >
            + Tambah Listing
          </Link>
          <Link
            href="/dashboard/langganan"
            className="flex items-center gap-2 border border-[#BFDBFE] hover:border-[#1D4ED8] text-slate-600 hover:text-[#1D4ED8] font-medium text-sm px-4 py-2 rounded-xl transition-colors font-sans"
          >
            <span className="text-xs">🥇</span> Upgrade Paket
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="bg-white border border-[#BFDBFE] rounded-2xl p-4 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-sans">{s.label}</span>
              <s.icon size={16} className="text-[#1D4ED8] opacity-60" />
            </div>
            {loading ? (
              <Loader2 size={18} className="animate-spin text-[#1D4ED8]" />
            ) : (
              <p className="font-heading font-bold text-2xl text-[#1E3A8A]">{s.value}</p>
            )}
            <p className="text-[11px] text-slate-400 font-sans">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium font-sans transition-colors ${
              a.urgent
                ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                : 'bg-white border border-[#BFDBFE] text-slate-700 hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
            }`}
          >
            <span>{a.label}</span>
            <ArrowRight size={14} />
          </Link>
        ))}
      </div>

      {/* Listing terbaru milik user */}
      <div className="bg-white border border-[#BFDBFE] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-[#1E3A8A]">Listing Saya</h2>
          <Link href="/dashboard/properti" className="text-sm text-[#1D4ED8] hover:underline font-sans">
            Lihat semua
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-sans">Memuat listing...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm font-sans mb-3">Belum ada listing</p>
            <Link
              href="/dashboard/properti/tambah"
              className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans"
            >
              + Tambah Listing Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.slice(0, 5).map(l => (
              <div
                key={l.id}
                className="flex items-center justify-between py-3 border-b border-[#EFF6FF] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">{l.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500 font-sans">{l.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      l.status === 'aktif'   ? 'bg-emerald-50 text-emerald-700' :
                      l.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{l.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-sans ml-3">
                  <span className="flex items-center gap-1"><Eye size={11} />{l.views ?? 0}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={11} />{l.inquiry_count ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 flex items-start gap-4">
        <Zap size={20} className="text-[#1D4ED8] mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-heading font-bold text-sm text-[#1E3A8A] mb-1">
            Tips: Tingkatkan visibilitas listing kamu
          </p>
          <p className="text-xs text-slate-500 font-sans">
            Listing dengan foto berkualitas dan deskripsi lengkap mendapat 3x lebih banyak views.
            Tambahkan minimal 5 foto dan isi semua detail properti.
          </p>
        </div>
      </div>

    </div>
  );
}
