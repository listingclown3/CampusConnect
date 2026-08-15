-- ============================================================
-- Let a client self-heal its own `public.users` row
--
-- 003_auth_provisioning.sql creates `public.users` via a trigger on
-- `auth.users` INSERT — the only path that existed for that row. If that
-- trigger ever misses for a given signup (e.g. this migration hadn't been
-- pushed to the database yet, or any future schema drift), the account was
-- permanently stuck: `profiles.user_id` has a FK to `users(id)`, so the
-- onboarding upsert into `profiles` fails, and there was no RLS policy
-- letting the client INSERT its own `users` row to recover — only
-- SELECT/UPDATE were granted (002_rls_policies.sql). This mirrors the
-- SELECT/UPDATE policies with an INSERT one scoped to the caller's own row,
-- so `src/lib/auth/context.tsx`'s `updateProfile` can upsert it defensively
-- before writing `profiles`.
-- ============================================================

CREATE POLICY "Users can insert own record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
