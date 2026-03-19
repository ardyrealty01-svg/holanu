'use client';

import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { UserButton } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#EFF6FF] overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#BFDBFE] px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-[#EFF6FF]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => alert('🔔 Notifikasi\n\n• Listing HOL-0089 mendapat 3 inquiry baru\n• Paket Gold berakhir dalam 7 hari\n• 1 listing menunggu review moderasi')}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-[#EFF6FF]"
              title="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D4ED8]" />
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: 'w-8 h-8 rounded-full' },
              }}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
