'use client';

import Link from 'next/link';
import { Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

const COLS = [
  {
    title: 'Properti',
    links: [
      { label: 'Rumah Dijual',      href: '/jual/rumah'       },
      { label: 'Rumah Disewa',      href: '/sewa/rumah'       },
      { label: 'Apartemen',         href: '/jual/apartemen'   },
      { label: 'Kavling & Tanah',   href: '/jual/tanah'       },
      { label: 'Ruko & Komersial',  href: '/jual/ruko'        },
      { label: 'Kost',              href: '/sewa/kost'        },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { label: 'Pasang Iklan Gratis', href: '/daftar'             },
      { label: 'Paket Premium',       href: '/dashboard/langganan'},
      { label: 'Konsultasi Gratis',   href: '/konsultasi'         },
      { label: 'Kalkulator KPR',      href: '/kalkulator/kpr'     },
      { label: 'Panduan Properti',    href: '/panduan'            },
      { label: 'Cari Agen',           href: '/agen'               },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang HOLANU', href: '/tentang-kami' },
      { label: 'Blog',           href: '/panduan'      },
      { label: 'Karir',         href: '/karir'         },
      { label: 'Hubungi Kami',  href: '/kontak'        },
      { label: 'FAQ',           href: '/faq'           },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
      { label: 'Kebijakan Privasi',  href: '/kebijakan-privasi'},
    ],
  },
];

const PAYMENT = ['QRIS', 'BCA', 'BNI', 'GoPay', 'OVO', 'ShopeePay', 'Indomaret'];

export function Footer() {
  return (
    <footer className="bg-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="font-display font-bold text-2xl text-[#BAE6FD] block mb-2">HOLANU</span>
            <p className="text-sm text-[#94A3B8] font-sans leading-relaxed mb-4">
              Platform marketplace properti digital Indonesia. Temukan, jual, dan sewa properti dengan mudah dan aman.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook,  label: 'Facebook'  },
                { icon: Twitter,   label: 'Twitter'   },
                { icon: Youtube,   label: 'YouTube'   },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-[#1E40AF] text-[#94A3B8] hover:border-[#1D4ED8] hover:text-[#BAE6FD] flex items-center justify-center transition-all"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-sans font-bold text-[#BAE6FD] text-xs uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-[#94A3B8] hover:text-[#BAE6FD] transition-colors font-sans">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment logos */}
        <div className="border-t border-[#1E40AF] pt-6 mb-6">
          <p className="text-[10px] text-[#64748B] font-sans mb-3 uppercase tracking-wider">Metode Pembayaran</p>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT.map(p => (
              <span key={p} className="text-[10px] font-bold text-[#64748B] bg-[#1E3A8A] border border-[#1E40AF] px-3 py-1.5 rounded-lg">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E40AF] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4B5563] font-sans">
            © 2025 HOLANU. Semua hak dilindungi.
          </p>
          <p className="text-xs text-[#4B5563] font-sans">
            Made with ❤️ in Indonesia 🇮🇩
          </p>
        </div>
      </div>
    </footer>
  );
}
