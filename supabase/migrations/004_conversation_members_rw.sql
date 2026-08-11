-- ============================================================
-- Missing conversation_members write policies
--
-- 002_rls_policies.sql only granted SELECT/INSERT on conversation_members,
-- but "mark conversation read" (UPDATE last_read_at) and "leave
-- conversation" (DELETE own row) both need to touch this table directly.
-- ============================================================

CREATE POLICY "Users can update own conversation membership"
  ON conversation_members FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can leave conversations"
  ON conversation_members FOR DELETE
  USING (user_id = auth.uid());
