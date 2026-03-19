import type { Metadata } from 'next';
import {
  Geist, Geist_Mono,
  Cormorant_Garamond, Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono,
} from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const geist      = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono  = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const cormorant  = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-display',
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-heading',
});
const dmSans     = DM_Sans({
  subsets: ['latin'], weight: ['400', '500'], variable: '--font-sans',
});
const jetbrains  = JetBrains_Mono({
  subsets: ['latin'], weight: ['400'], variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'HOLANU - Marketplace Properti Indonesia',
  description:
    'Temukan properti impianmu di Indonesia. Rumah, tanah, apartemen, villa, kost — dari agen terpercaya di seluruh Indonesia.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export function generateViewport() {
  return {
    width:        'device-width',
    initialScale: 1,
    maximumScale: 1,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={[
        geist.variable, geistMono.variable,
        cormorant.variable, plusJakarta.variable,
        dmSans.variable, jetbrains.variable,
      ].join(' ')}
    >
      <body className="font-sans antialiased">
        <ClerkProvider
          signInUrl="/masuk"
          signUpUrl="/daftar"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
