// Centralized allowed-email-domain check for sign-in/sign-up.
// Client-side gate only: it controls when we call signInWithOtp, it does not
// stop Supabase from accepting an OTP for any address someone lands on this
// call for. Real enforcement of "must be an SJSU student" would need a
// Supabase Auth Hook checked server-side; out of scope for tonight.
export const ALLOWED_EMAIL_SUFFIX = '@sjsu.edu';

export function isAllowedEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_SUFFIX);
}
