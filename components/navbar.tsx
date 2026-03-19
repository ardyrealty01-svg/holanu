'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, UserPlus, LayoutDashboard } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const NAV_ITEMS = [
  { label: 'Jual',           href: '/jual'          },
  { label: 'Sewa',           href: '/sewa'          },
  { label: 'Agen',           href: '/agen'          },
  { label: 'Panduan',        href: '/panduan'       },
  { label: 'Kalkulator KPR', href: '/kalkulator/kpr'},
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#1D4ED8] text-white text-center py-2 text-xs font-medium font-sans">
        Daftar sekarang — pasang iklan properti <strong>GRATIS</strong>. Bergabung dengan 10.000+ agen aktif.
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-[#BFDBFE] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-display font-bold text-xl text-[#1E3A8A]">HOLANU</span>
            <span className="text-[#94A3B8] text-xs font-medium font-sans hidden sm:inline">
              Marketplace Properti
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#475569] hover:text-[#1D4ED8] transition-colors font-medium text-sm font-sans"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <SignedOut>
              <Link
                href="/masuk"
                className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#DBEAFE] px-4 py-2 rounded-lg text-sm font-semibold transition-colors font-sans"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors font-sans flex items-center gap-1.5 shadow-sm shadow-blue-200"
              >
                <UserPlus size={15} />
                Daftar Gratis
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#DBEAFE] px-4 py-2 rounded-lg text-sm font-semibold transition-colors font-sans flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: { avatarBox: 'w-9 h-9 rounded-lg' },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#475569] hover:bg-[#EFF6FF] transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#BFDBFE] bg-white px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[#475569] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-lg transition-colors font-sans"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#BFDBFE] mt-3">
              <SignedOut>
                <Link href="/masuk" onClick={() => setMobileOpen(false)}
                  className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-4 py-2.5 rounded-lg text-sm font-semibold w-full font-sans text-center">
                  Masuk
                </Link>
                <Link href="/daftar" onClick={() => setMobileOpen(false)}
                  className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2.5 rounded-lg text-sm font-semibold w-full font-sans flex items-center justify-center gap-1.5">
                  <UserPlus size={15} /> Daftar Gratis
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="bg-[#1D4ED8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold w-full font-sans flex items-center justify-center gap-1.5">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
