'use client';

import type { Message, Conversation, ConversationMember } from '@/types/database';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import {
  getStoredConversations,
  setStoredConversations,
  getStoredMembers,
  setStoredMembers,
  getStoredMessages,
  setStoredMessages,
  STORAGE_KEYS,
} from '@/lib/data/storage';
import { mockStudents } from '@/lib/mock-data/students';
import { notifyStorageChange } from '@/lib/storage-sync';
import { notifyNewMessage } from '@/lib/notifications/store';

// ============================================================
// Block helpers
// ============================================================

export interface BlockEntry {
  blocker_id: string;
  blocked_user_id: string;
  created_at: string;
}

export function getBlocks(): BlockEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BLOCKS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addBlock(blockerId: string, blockedUserId: string): void {
  const blocks = getBlocks();
  blocks.push({
    blocker_id: blockerId,
    blocked_user_id: blockedUserId,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  notifyStorageChange();
}

export function isBlocked(userId: string, otherUserId: string): boolean {
  const blocks = getBlocks();
  return blocks.some(
    (b) =>
      (b.blocker_id === userId && b.blocked_user_id === otherUserId) ||
      (b.blocker_id === otherUserId && b.blocked_user_id === userId)
  );
}

// ============================================================
// Data Access Functions (Mock Mode)
// ============================================================

export function getUserConversations(userId: string): Conversation[] {
  const conversations = getStoredConversations();
  const members = getStoredMembers();
  const userConvIds = members
    .filter((cm) => cm.user_id === userId)
    .map((cm) => cm.conversation_id);
  return conversations
    .filter((c) => userConvIds.includes(c.id))
    .sort((a, b) => {
      const aTime = a.last_message_at || a.created_at;
      const bTime = b.last_message_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
}

export function getConversationById(conversationId: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations.find((c) => c.id === conversationId) || null;
}

export function getConversationMessages(conversationId: string): Message[] {
  const messages = getStoredMessages();
  return messages
    .filter((m) => m.conversation_id === conversationId)
    .sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export function getConversationMembersList(conversationId: string): ConversationMember[] {
  const members = getStoredMembers();
  return members.filter((cm) => cm.conversation_id === conversationId);
}

export function isUserMember(conversationId: string, userId: string): boolean {
  const members = getStoredMembers();
  return members.some(
    (cm) => cm.conversation_id === conversationId && cm.user_id === userId
  );
}

export function getLastMessage(conversationId: string): Message | null {
  const messages = getConversationMessages(conversationId);
  return messages.length > 0 ? messages[messages.length - 1] : null;
}

export function getUnreadCount(conversationId: string, userId: string): number {
  const members = getStoredMembers();
  const member = members.find(
    (cm) => cm.conversation_id === conversationId && cm.user_id === userId
  );
  if (!member || !member.last_read_at) {
    const messages = getConversationMessages(conversationId);
    return messages.filter((m) => m.sender_id !== userId).length;
  }
  const messages = getConversationMessages(conversationId);
  return messages.filter(
    (m) =>
      m.sender_id !== userId &&
      new Date(m.created_at).getTime() > new Date(member.last_read_at!).getTime()
  ).length;
}

export function markConversationRead(conversationId: string, userId: string): void {
  const members = getStoredMembers();
  const idx = members.findIndex(
    (cm) => cm.conversation_id === conversationId && cm.user_id === userId
  );
  if (idx >= 0) {
    members[idx] = { ...members[idx], last_read_at: new Date().toISOString() };
    setStoredMembers(members);
  }
}

// ============================================================
// Message Sending
// ============================================================

export function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Message {
  const messages = getStoredMessages();
  const newMessage: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    message_type: 'text',
    metadata: null,
    is_edited: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  messages.push(newMessage);
  setStoredMessages(messages);

  // Update conversation's last_message_at
  const conversations = getStoredConversations();
  const convIdx = conversations.findIndex((c) => c.id === conversationId);
  if (convIdx >= 0) {
    conversations[convIdx] = {
      ...conversations[convIdx],
      last_message_at: newMessage.created_at,
      updated_at: newMessage.created_at,
    };
    setStoredConversations(conversations);
  }

  // Mark as read for sender
  markConversationRead(conversationId, senderId);

  // Trigger notification for other members in the conversation
  const convMembers = getConversationMembersList(conversationId);
  const senderName = getUserFirstName(senderId);
  for (const member of convMembers) {
    if (member.user_id !== senderId) {
      notifyNewMessage(senderName, conversationId, content);
    }
  }

  return newMessage;
}

// ============================================================
// Conversation Creation
// ============================================================

export function findDirectConversation(
  userId1: string,
  userId2: string
): Conversation | null {
  const conversations = getStoredConversations();
  const members = getStoredMembers();

  for (const conv of conversations) {
    if (conv.type !== 'direct') continue;
    const convMembers = members.filter((cm) => cm.conversation_id === conv.id);
    const hasUser1 = convMembers.some((cm) => cm.user_id === userId1);
    const hasUser2 = convMembers.some((cm) => cm.user_id === userId2);
    if (hasUser1 && hasUser2 && convMembers.length === 2) {
      return conv;
    }
  }
  return null;
}

export function createDirectConversation(
  userId1: string,
  userId2: string
): Conversation {
  // Check if already exists
  const existing = findDirectConversation(userId1, userId2);
  if (existing) return existing;

  const now = new Date().toISOString();
  const convId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const newConv: Conversation = {
    id: convId,
    type: 'direct',
    name: null,
    pod_id: null,
    event_id: null,
    created_by: userId1,
    last_message_at: null,
    created_at: now,
    updated_at: now,
  };

  const conversations = getStoredConversations();
  conversations.push(newConv);
  setStoredConversations(conversations);

  // Add members
  const members = getStoredMembers();
  members.push(
    {
      id: `cm-${Date.now()}-1`,
      conversation_id: convId,
      user_id: userId1,
      joined_at: now,
      last_read_at: now,
      is_muted: false,
    },
    {
      id: `cm-${Date.now()}-2`,
      conversation_id: convId,
      user_id: userId2,
      joined_at: now,
      last_read_at: now,
      is_muted: false,
    }
  );
  setStoredMembers(members);

  return newConv;
}

// ============================================================
// Leave Conversation
// ============================================================

export function leaveConversation(conversationId: string, userId: string): void {
  const members = getStoredMembers();
  const filtered = members.filter(
    (cm) => !(cm.conversation_id === conversationId && cm.user_id === userId)
  );
  setStoredMembers(filtered);
}

// ============================================================
// Helper: Get other user in direct conversation
// ============================================================

export function getOtherUserInDirect(
  conversationId: string,
  currentUserId: string
): string | null {
  const members = getConversationMembersList(conversationId);
  const other = members.find((cm) => cm.user_id !== currentUserId);
  return other?.user_id || null;
}

export function getUserDisplayName(userId: string): string {
  const student = mockStudents.find((s) => s.user_id === userId || s.id === userId);
  if (student) return `${student.first_name} ${student.last_name}`;
  return 'Unknown User';
}

export function getUserFirstName(userId: string): string {
  const student = mockStudents.find((s) => s.user_id === userId || s.id === userId);
  if (student) return student.first_name;
  return 'Unknown';
}

// ============================================================
// Supabase Realtime (when configured)
// ============================================================

type MessageCallback = (message: Message) => void;
const subscriptions = new Map<string, { unsubscribe: () => void }>();

export function subscribeToConversation(
  conversationId: string,
  onMessage: MessageCallback
): { unsubscribe: () => void } {
  // Guard against re-subscribing to a conversation that already has a live
  // subscription (e.g. React effect double-invocation in dev, or rapid
  // navigation) — leaves a fully torn-down channel behind so `client.channel()`
  // below can't hand back an already-joined instance.
  unsubscribeFromConversation(conversationId);

  if (!isSupabaseConfigured()) {
    // In mock mode, no real-time subscription needed
    // Messages are read from localStorage directly
    const sub = { unsubscribe: () => {} };
    subscriptions.set(conversationId, sub);
    return sub;
  }

  const client = createClient();
  if (!client) {
    const sub = { unsubscribe: () => {} };
    subscriptions.set(conversationId, sub);
    return sub;
  }

  const channel = client
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  const sub = {
    unsubscribe: () => {
      // Must use removeChannel (not channel.unsubscribe()) so the channel is
      // also removed from the client's internal registry — otherwise the next
      // client.channel() call for this topic returns the stale, already-joined
      // instance and `.on()` throws "... after subscribe()".
      client.removeChannel(channel);
      subscriptions.delete(conversationId);
    },
  };
  subscriptions.set(conversationId, sub);
  return sub;
}

export function unsubscribeFromConversation(conversationId: string): void {
  const sub = subscriptions.get(conversationId);
  if (sub) {
    sub.unsubscribe();
    subscriptions.delete(conversationId);
  }
}

export function unsubscribeAll(): void {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions.clear();
}
