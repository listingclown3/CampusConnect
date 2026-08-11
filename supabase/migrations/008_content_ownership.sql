-- ============================================================
-- User-created content: missing owner column + RLS
--
-- The schema only ever anticipated admin-curated clubs (no created_by
-- column, no INSERT/UPDATE/DELETE policy at all) and partially-writable
-- pods/events (INSERT+UPDATE but no DELETE on pods; INSERT but no
-- UPDATE/DELETE on events). The app's UI lets any signed-in user create a
-- pod/event/club (src/lib/data/crud-storage.ts), so all three need full
-- create/edit/delete support for their own content.
-- ============================================================

ALTER TABLE clubs ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE POLICY "Users can create clubs"
  ON clubs FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Club creators can update clubs"
  ON clubs FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Club creators can delete clubs"
  ON clubs FOR DELETE
  USING (created_by = auth.uid());

CREATE POLICY "Pod creators can delete pods"
  ON pods FOR DELETE
  USING (created_by = auth.uid());

CREATE POLICY "Organizers can update events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete events"
  ON events FOR DELETE
  USING (organizer_id = auth.uid());
