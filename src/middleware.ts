import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection.
 * 
 * In mock mode (no Supabase), auth is managed client-side via localStorage.
 * The main layout handles redirect for unauthenticated users.
 * 
 * This middleware handles:
 * - Public routes: /, /login, /signup (always accessible)
 * - Protected routes: everything else (client-side auth check in layout)
 * 
 * When Supabase is configured, this would check the session cookie.
 */
export function middleware(request: NextRequest) {
  // In mock mode, let all requests through - client-side auth handles redirects
  // When Supabase is added, we would check the session here
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
