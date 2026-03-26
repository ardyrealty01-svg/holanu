/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
  },

  /**
   * API Proxy Rewrites — mengatasi CORS di local development
   *
   * LOCAL DEV (.env.local: NEXT_PUBLIC_API_URL="..."):
   *   Jika ada komponen yang fetch() ke /api/path, Next.js akan mem-proxy
   *   request tersebut ke NEXT_PUBLIC_API_URL.
   *
   * PRODUCTION (Vercel):
   *   Proxy tidak aktif. Client fetch langsung ke NEXT_PUBLIC_API_URL.
   */
  async rewrites() {
    const isLocal = !process.env.VERCEL && !process.env.CF_PAGES;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Proxy hanya aktif di local dev dan jika env var-nya ada.
    if (!isLocal || !apiUrl) {
      return [];
    }

    return [
      {
        source:      '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
