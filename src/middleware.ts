import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware placeholder - intentionally a no-op in the current architecture.
 *
 * Why this exists:
 * When Supabase authentication is configured, this middleware will be extended
 * to verify the session cookie on each request and redirect unauthenticated
 * users to /login server-side (before any client JS runs).
 *
 * Current behavior:
 * All requests pass through unchanged. Route protection is handled entirely
 * client-side by the (main)/layout.tsx AuthProvider, which redirects
 * unauthenticated users via router.push('/login'). This means there is a
 * brief "null render" while the client-side check runs - acceptable for a
 * demo/MVP but should be replaced with proper cookie-based session validation
 * before production use.
 *
 * Future implementation would:
 * 1. Read the Supabase auth cookie from the request
 * 2. Verify the JWT server-side
 * 3. Redirect to /login if invalid/missing (for protected routes)
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
