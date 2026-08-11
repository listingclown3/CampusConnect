import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Destination for Supabase's email OTP / magic link (see emailRedirectTo in
// src/lib/auth/context.tsx). Exchanges the one-time code for a session, then
// sends the user to onboarding (profile row won't exist yet on first login;
// the onboarding form creates it) or straight to the dashboard.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('user_id', data.user.id)
    .maybeSingle();

  const destination = profile?.onboarding_complete ? '/dashboard' : '/onboarding';
  return NextResponse.redirect(`${origin}${destination}`);
}
