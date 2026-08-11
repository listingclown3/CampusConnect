import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Named `proxy.ts` (not `middleware.ts`) — this Next.js version renamed the
// convention. Refreshes the Supabase auth session cookie on every request so
// server components always see a valid session.
export async function proxy(request: NextRequest) {
  // Supabase's email-link redirect falls back to the project's bare Site
  // URL (dropping any path) whenever the intended emailRedirectTo isn't on
  // the Redirect URLs allow-list, or an old email predates a config change.
  // Rather than depend on getting that dashboard config exactly right,
  // forward a stray auth code landing on `/` to the real callback route.
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const callbackUrl = new URL('/auth/callback', request.url);
    callbackUrl.search = request.nextUrl.search;
    return NextResponse.redirect(callbackUrl);
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Touch the session so @supabase/ssr can refresh an expiring token.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|images/|sw.js).*)',
  ],
};
