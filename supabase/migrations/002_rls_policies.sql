-- ============================================================
-- Row Level Security Policies
-- ============================================================

-- ============================================================
-- Users
-- ============================================================

CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- Profiles
-- ============================================================

-- Users can view visible profiles (for matching/browsing)
CREATE POLICY "Users can view visible profiles"
  ON profiles FOR SELECT
  USING (
    is_visible = true
    OR user_id = auth.uid()
  );

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Classes
-- ============================================================

-- All authenticated users can view classes
CREATE POLICY "Authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- User Classes
-- ============================================================

-- Users can view all enrollments (needed for matching)
CREATE POLICY "Authenticated users can view enrollments"
  ON user_classes FOR SELECT
  TO authenticated
  USING (true);

-- Users can only manage their own enrollments
CREATE POLICY "Users can insert own enrollments"
  ON user_classes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own enrollments"
  ON user_classes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Matches
-- ============================================================

-- Users can view their own matches
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (user_id = auth.uid() OR matched_user_id = auth.uid());

-- System can insert matches (via service role)
CREATE POLICY "Service role can insert matches"
  ON matches FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Users can update match status on their own matches
CREATE POLICY "Users can update own match status"
  ON matches FOR UPDATE
  USING (user_id = auth.uid() OR matched_user_id = auth.uid());

-- ============================================================
-- Match Actions
-- ============================================================

CREATE POLICY "Users can view own match actions"
  ON match_actions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own match actions"
  ON match_actions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- Pods
-- ============================================================

-- All authenticated users can view active pods
CREATE POLICY "Authenticated users can view active pods"
  ON pods FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Users can create pods
CREATE POLICY "Users can create pods"
  ON pods FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Pod creators can update their pods
CREATE POLICY "Pod creators can update pods"
  ON pods FOR UPDATE
  USING (created_by = auth.uid());

-- ============================================================
-- Pod Members
-- ============================================================

-- Pod members can view other members in their pods
CREATE POLICY "Pod members can view pod members"
  ON pod_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pod_members pm
      WHERE pm.pod_id = pod_members.pod_id
      AND pm.user_id = auth.uid()
    )
  );

-- Users can join pods
CREATE POLICY "Users can join pods"
  ON pod_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave pods
CREATE POLICY "Users can leave pods"
  ON pod_members FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Conversations
-- ============================================================

-- Users can view conversations they are a member of
CREATE POLICY "Members can view conversations"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversations.id
      AND cm.user_id = auth.uid()
    )
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Conversation members can update the conversation
CREATE POLICY "Members can update conversations"
  ON conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversations.id
      AND cm.user_id = auth.uid()
    )
  );

-- ============================================================
-- Conversation Members
-- ============================================================

-- Members can view members of their conversations
CREATE POLICY "Members can view conversation members"
  ON conversation_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
    )
  );

-- Users can add members (if they are a member)
CREATE POLICY "Members can add conversation members"
  ON conversation_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- ============================================================
-- Messages
-- ============================================================

-- Members can view messages in their conversations
CREATE POLICY "Members can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
      AND cm.user_id = auth.uid()
    )
  );

-- Members can send messages in their conversations
CREATE POLICY "Members can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
      AND cm.user_id = auth.uid()
    )
  );

-- Users can edit their own messages
CREATE POLICY "Users can edit own messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid());

-- ============================================================
-- Clubs
-- ============================================================

-- All authenticated users can view active clubs
CREATE POLICY "Authenticated users can view clubs"
  ON clubs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================
-- Events
-- ============================================================

-- All authenticated users can view events
CREATE POLICY "Authenticated users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Organizers can create events
CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (organizer_id = auth.uid());

-- ============================================================
-- Event RSVPs
-- ============================================================

-- Users can view RSVPs for events
CREATE POLICY "Users can view event RSVPs"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (true);

-- Users can manage their own RSVPs
CREATE POLICY "Users can insert own RSVPs"
  ON event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own RSVPs"
  ON event_rsvps FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own RSVPs"
  ON event_rsvps FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Reports
-- ============================================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- ============================================================
-- Blocks
-- ============================================================

-- Users can view their own blocks
CREATE POLICY "Users can view own blocks"
  ON blocks FOR SELECT
  USING (blocker_id = auth.uid());

-- Users can block others
CREATE POLICY "Users can create blocks"
  ON blocks FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

-- Users can unblock
CREATE POLICY "Users can delete own blocks"
  ON blocks FOR DELETE
  USING (blocker_id = auth.uid());

-- ============================================================
-- Helper: Filter blocked users from profile visibility
-- ============================================================
-- Profiles of users who have blocked you or whom you have blocked
-- should not be visible in matching results.
-- This is enforced at the application level via the filterBlockedUsers function.
