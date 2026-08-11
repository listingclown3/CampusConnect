-- ============================================================
-- Auto-provision public.users on Supabase Auth signup
--
-- 002_rls_policies.sql only grants SELECT/UPDATE on `users`, so a client
-- (even authenticated) can never INSERT its own row directly. Rather than
-- widen RLS, mirror the standard Supabase pattern: a SECURITY DEFINER
-- trigger on auth.users creates the matching public.users row, bypassing
-- RLS entirely. `profiles` is still created by the client during onboarding
-- (it has its own auth.uid() = user_id INSERT policy already).
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
