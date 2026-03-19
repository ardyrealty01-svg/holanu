'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Home, DollarSign, Settings,
  FileText, Bell, BarChart2, Shield, Sliders, LogOut,
  MessageSquare, X, ChevronRight,
} from 'lucide-react';

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Command Center' },
  { href: '/admin/users',      icon: Users,           label: 'Manajemen Users' },
  { href: '/admin/listing',    icon: Home,            label: 'Manajemen Listing' },
  { href: '/admin/transaksi',  icon: DollarSign,      label: 'Transaksi & Keuangan' },
  { href: '/admin/paket',      icon: Sliders,         label: 'Paket & Subscription' },
  { href: '/admin/konten',     icon: FileText,        label: 'Konten & SEO' },
  { href: '/admin/broadcast',  icon: Bell,            label: 'Notifikasi & Broadcast' },
  { href: '/admin/laporan',    icon: BarChart2,       label: 'Laporan & Analytics' },
  { href: '/admin/keamanan',   icon: Shield,          label: 'Keamanan & Moderasi' },
  { href: '/admin/pengaturan', icon: Settings,        label: 'Pengaturan Sistem' },
];

interface Props { onClose?: () => void }

export function AdminSidebar({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-[#0F2044] w-64">
      <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(29,78,216,0.12)]">
        <div>
          <span className="font-display font-bold text-lg text-[#BAE6FD]">HOLANU</span>
          <span className="ml-2 text-[9px] font-bold bg-red-900 text-red-300 px-1.5 py-0.5 rounded font-sans">SUPER ADMIN</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Admin info */}
      <div className="px-5 py-3 border-b border-[rgba(29,78,216,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-900 text-red-300 flex items-center justify-center text-xs font-bold flex-shrink-0">SA</div>
          <div>
            <p className="text-white text-xs font-semibold font-heading">Super Admin</p>
            <p className="text-[#94A3B8] text-[10px] font-sans">admin@holanu.id</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg group transition-all ${
                active
                  ? 'bg-[rgba(186,230,253,0.12)] text-[#BAE6FD]'
                  : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={15} className={active ? 'text-[#BAE6FD]' : 'text-slate-600 group-hover:text-white'} />
                <span className="text-xs font-sans font-medium">{label}</span>
              </div>
              {active && <ChevronRight size={12} className="text-[#BAE6FD]" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[rgba(29,78,216,0.08)]">
        <Link
          href="/masuk"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[rgba(239,68,68,0.1)] hover:text-red-400 transition-all"
        >
          <LogOut size={15} />
          <span className="text-xs font-sans font-medium">Keluar</span>
        </Link>
      </div>
    </aside>
  );
}
