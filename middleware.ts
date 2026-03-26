import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// ── Role Cache ───────────────────────────────────────
// Short-lived cache untuk mengurangi Clerk API calls
// pada admin route. Cache hanya disimpan selama request,
// tidak persisten antar cold start.
const ROLE_CACHE_TTL = 5 * 60 * 1000; // 5 menit
const roleCache = new Map<string, { role: string; expiry: number }>();

function getCachedRole(userId: string): string | null {
  const cached = roleCache.get(userId);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    roleCache.delete(userId);
    return null;
  }
  return cached.role;
}

function setCachedRole(userId: string, role: string): void {
  roleCache.set(userId, { role, expiry: Date.now() + ROLE_CACHE_TTL });
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Redirect ke /masuk jika belum login
  if (isProtectedRoute(req) && !userId) {
    const masukUrl = new URL('/masuk', req.url);
    masukUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(masukUrl);
  }

  // 2. Cek role admin via clerkClient (cara yang benar di Clerk v6)
  if (isAdminRoute(req) && userId) {
    try {
      // Cek cache dulu
      let role = getCachedRole(userId);
      if (role === null) {
        // Cache miss — fetch dari Clerk
        const client = await clerkClient();
        const user   = await client.users.getUser(userId);
        const fetchedRole: string = (user.publicMetadata as any)?.role ?? '';
        setCachedRole(userId, fetchedRole);
        role = fetchedRole;
      }

      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch {
      // Jika gagal fetch user, tolak akses admin
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
