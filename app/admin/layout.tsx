'use client';

import { useState } from 'react';
import { Menu, Bell, RefreshCw } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#EFF6FF] overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10"><AdminSidebar onClose={() => setSidebarOpen(false)} /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* System status bar */}
        <div className="bg-[#0F2044] text-[10px] font-mono text-[#94A3B8] px-4 py-1.5 flex items-center gap-4 overflow-x-auto whitespace-nowrap flex-shrink-0">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />System Normal</span>
          <span>D1: 2.1GB/5GB</span>
          <span>Workers: 43K/100K req</span>
          <span>ImageKit: 8.2GB/20GB</span>
          <span>KV: 12K/100K</span>
          <span className="ml-auto">Last deploy: 2j lalu</span>
        </div>
        <header className="bg-white border-b border-[#BFDBFE] px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-[#EFF6FF]" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 text-xs text-slate-500 border border-[#BFDBFE] px-3 py-1.5 rounded-lg hover:bg-[#EFF6FF] font-sans transition-colors"
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              onClick={() => alert('🔔 Notifikasi Admin\n\n• 5 listing dilaporkan menunggu review\n• 3 leads konsultasi baru hari ini\n• 23 users pending verifikasi Tier 2\n• Backup D1 berhasil 06:00 WIB')}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-[#EFF6FF]"
              title="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-red-900 text-red-300 flex items-center justify-center text-xs font-bold">SA</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
