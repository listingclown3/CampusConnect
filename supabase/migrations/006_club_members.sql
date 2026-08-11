-- ============================================================
-- Club membership table
--
-- The schema had no club_members table at all (confirmed via REST: 404
-- on that table), but event-actions.ts's isUserInClub/joinClub/leaveClub/
-- getClubMemberCount need somewhere to persist real membership once
-- Supabase is configured. Mirrors the pod_members shape/RLS pattern.
-- ============================================================

CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_club_member UNIQUE (club_id, user_id)
);

CREATE INDEX idx_club_members_club_id ON club_members(club_id);
CREATE INDEX idx_club_members_user_id ON club_members(user_id);

ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view club members"
  ON club_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join clubs"
  ON club_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave clubs"
  ON club_members FOR DELETE
  USING (user_id = auth.uid());
