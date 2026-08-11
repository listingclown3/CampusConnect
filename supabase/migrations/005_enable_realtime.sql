-- ============================================================
-- Enable Realtime on messages
--
-- postgres_changes subscriptions (see src/lib/chat/realtime.ts's
-- subscribeToConversation) only fire for tables added to the
-- supabase_realtime publication — this is off by default per table.
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
