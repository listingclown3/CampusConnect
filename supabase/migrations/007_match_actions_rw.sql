-- ============================================================
-- Missing matches/match_actions write policies
--
-- 002_rls_policies.sql assumed a server-side matching pipeline writes
-- `matches` rows (INSERT restricted to service_role) and that
-- `match_actions` is append-only (no UPDATE/DELETE). The app's actual UX is
-- user-driven instead: matches/page.tsx computes scores client-side and
-- "save"/"skip" are direct user actions that need to change/undo their own
-- match_actions row, and need to be able to create a `matches` row for a
-- profile they've browsed that doesn't have one yet.
-- ============================================================

CREATE POLICY "Users can insert own matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own match actions"
  ON match_actions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own match actions"
  ON match_actions FOR DELETE
  USING (user_id = auth.uid());
