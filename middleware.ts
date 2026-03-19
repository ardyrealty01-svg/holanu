import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (isProtectedRoute(req) && !userId) {
    const masukUrl = new URL('/masuk', req.url);
    masukUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(masukUrl);
  }

  if (isAdminRoute(req) && userId) {
    // Clerk stores custom roles in publicMetadata, not metadata
    const role = (sessionClaims?.metadata as any)?.role
              ?? (sessionClaims as any)?.public_metadata?.role;
    if (role !== 'admin') {
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
