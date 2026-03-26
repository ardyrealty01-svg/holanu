'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  LayoutDashboard, Home, MessageSquare, FileText,
  CreditCard, BarChart2, Settings, LogOut, ShieldCheck,
  HelpCircle, ChevronRight, X, Heart,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',            icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/properti',   icon: Home,            label: 'Properti Saya' },
  { href: '/dashboard/inquiry',    icon: MessageSquare,   label: 'Inquiry & CRM' },
  { href: '/dashboard/tersimpan',  icon: Heart,           label: 'Tersimpan' },
  { href: '/dashboard/form',       icon: FileText,        label: 'Form & Kontrak', badge: 'Pro' },
  { href: '/dashboard/langganan',  icon: CreditCard,      label: 'Langganan & Billing' },
  { href: '/dashboard/analitik',   icon: BarChart2,       label: 'Analitik' },
  { href: '/dashboard/profil',     icon: Settings,        label: 'Profil & Pengaturan' },
];

interface Props { onClose?: () => void }

export function DashboardSidebar({ onClose }: Props) {
  const pathname    = usePathname();
  const { user }    = useUser();
  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Agen' : 'Agen HOLANU';
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="flex flex-col h-full bg-[#1E3A8A] w-64">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(29,78,216,0.15)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-[#BAE6FD]">HOLANU</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Agent Info */}
      <div className="px-5 py-4 border-b border-[rgba(29,78,216,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold font-heading truncate">{displayName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-[10px] text-[#BAE6FD] font-sans font-medium">🟢 Terverifikasi</span>
            </div>
          </div>
        </div>
        {/* Quota bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400 font-sans">Kuota Listing</span>
            <span className="text-[10px] text-[#BAE6FD] font-mono">12/30</span>
          </div>
          <div className="h-1.5 bg-[#1E40AF] rounded-full overflow-hidden">
            <div className="h-full bg-[#1D4ED8] rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg group transition-all duration-150 ${
                active
                  ? 'bg-[rgba(186,230,253,0.12)] text-[#BAE6FD]'
                  : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={active ? 'text-[#BAE6FD]' : 'text-slate-500 group-hover:text-white'} />
                <span className="text-sm font-sans font-medium">{label}</span>
              </div>
              <div className="flex items-center gap-1">
                {badge && (
                  <span className="text-[9px] font-bold bg-[#1D4ED8] text-white px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
                {active && <ChevronRight size={13} className="text-[#BAE6FD]" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[rgba(29,78,216,0.1)] space-y-0.5">
        <Link
          href="/dashboard/bantuan"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all"
        >
          <HelpCircle size={16} className="text-slate-500" />
          <span className="text-sm font-sans font-medium">Bantuan Live Chat</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </Link>
        <Link
          href="/masuk"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#94A3B8] hover:bg-[rgba(239,68,68,0.1)] hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm font-sans font-medium">Keluar</span>
        </Link>
      </div>
    </aside>
  );
}
