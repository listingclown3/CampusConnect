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

export async function getBlocks(userId: string): Promise<BlockEntry[]> {
  if (!isSupabaseConfigured()) {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      const all = stored ? (JSON.parse(stored) as BlockEntry[]) : [];
      return all.filter((b) => b.blocker_id === userId || b.blocked_user_id === userId);
    } catch {
      return [];
    }
  }
  const client = createClient();
  if (!client) return [];
  // RLS only lets a client see blocks it created (blocker_id = auth.uid()),
  // so unlike mock mode this can't also see "someone blocked me" — that's
  // enforced server-side instead (see the profile-visibility RLS policy).
  const { data } = await client.from('blocks').select('*').eq('blocker_id', userId);
  return (data as BlockEntry[]) ?? [];
}

export async function addBlock(blockerId: string, blockedUserId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.BLOCKS);
    const blocks: BlockEntry[] = stored ? JSON.parse(stored) : [];
    blocks.push({ blocker_id: blockerId, blocked_user_id: blockedUserId, created_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    notifyStorageChange();
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('blocks').insert({ blocker_id: blockerId, blocked_user_id: blockedUserId });
}

// ============================================================
// Data Access Functions
// ============================================================

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) {
    const conversations = getStoredConversations();
    const members = getStoredMembers();
    const userConvIds = members.filter((cm) => cm.user_id === userId).map((cm) => cm.conversation_id);
    return conversations
      .filter((c) => userConvIds.includes(c.id))
      .sort((a, b) => {
        const aTime = a.last_message_at || a.created_at;
        const bTime = b.last_message_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }
  const client = createClient();
  if (!client) return [];
  const { data: memberships } = await client
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);
  const convIds = (memberships ?? []).map((m) => m.conversation_id);
  if (convIds.length === 0) return [];
  const { data } = await client
    .from('conversations')
    .select('*')
    .in('id', convIds)
    .order('last_message_at', { ascending: false, nullsFirst: false });
  return (data as Conversation[]) ?? [];
}

export async function getConversationById(conversationId: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    const conversations = getStoredConversations();
    return conversations.find((c) => c.id === conversationId) || null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client.from('conversations').select('*').eq('id', conversationId).maybeSingle();
  return data as Conversation | null;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  if (!isSupabaseConfigured()) {
    const messages = getStoredMessages();
    return messages
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return (data as Message[]) ?? [];
}

export async function getConversationMembersList(conversationId: string): Promise<ConversationMember[]> {
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    return members.filter((cm) => cm.conversation_id === conversationId);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('conversation_members').select('*').eq('conversation_id', conversationId);
  return (data as ConversationMember[]) ?? [];
}

/** Members across every conversation the user belongs to, in one query — used to
 * populate ChatProvider's synchronous lookup caches (avoids an N-query fan-out). */
export async function getMembersForConversations(conversationIds: string[]): Promise<ConversationMember[]> {
  if (conversationIds.length === 0) return [];
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    return members.filter((cm) => conversationIds.includes(cm.conversation_id));
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('conversation_members').select('*').in('conversation_id', conversationIds);
  return (data as ConversationMember[]) ?? [];
}

/** All messages across the given conversations, in one query — ChatProvider
 * derives last-message and unread counts from this instead of N per-conversation
 * calls. */
export async function getMessagesForConversations(conversationIds: string[]): Promise<Message[]> {
  if (conversationIds.length === 0) return [];
  if (!isSupabaseConfigured()) {
    return getStoredMessages()
      .filter((m) => conversationIds.includes(m.conversation_id))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client
    .from('messages')
    .select('*')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true });
  return (data as Message[]) ?? [];
}

/** Display names for a batch of users, in one query. */
export async function getDisplayNamesForUsers(userIds: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(userIds)];
  if (unique.length === 0) return {};
  if (!isSupabaseConfigured()) {
    const result: Record<string, string> = {};
    for (const id of unique) {
      const student = mockStudents.find((s) => s.user_id === id || s.id === id);
      result[id] = student ? `${student.first_name} ${student.last_name}` : 'Unknown User';
    }
    return result;
  }
  const client = createClient();
  if (!client) return {};
  const { data } = await client.from('profiles').select('user_id,first_name,last_name').in('user_id', unique);
  const result: Record<string, string> = {};
  for (const p of data ?? []) {
    result[p.user_id] = `${p.first_name} ${p.last_name}`;
  }
  return result;
}

export async function isUserMember(conversationId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    return members.some((cm) => cm.conversation_id === conversationId && cm.user_id === userId);
  }
  const client = createClient();
  if (!client) return false;
  const { data } = await client
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}

export async function getLastMessage(conversationId: string): Promise<Message | null> {
  if (!isSupabaseConfigured()) {
    const messages = await getConversationMessages(conversationId);
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as Message | null;
}

export async function getUnreadCount(conversationId: string, userId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    const member = members.find((cm) => cm.conversation_id === conversationId && cm.user_id === userId);
    const messages = await getConversationMessages(conversationId);
    if (!member || !member.last_read_at) {
      return messages.filter((m) => m.sender_id !== userId).length;
    }
    return messages.filter(
      (m) => m.sender_id !== userId && new Date(m.created_at).getTime() > new Date(member.last_read_at!).getTime()
    ).length;
  }
  const client = createClient();
  if (!client) return 0;
  const { data: member } = await client
    .from('conversation_members')
    .select('last_read_at')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();
  let query = client
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
  if (member?.last_read_at) {
    query = query.gt('created_at', member.last_read_at);
  }
  const { count } = await query;
  return count ?? 0;
}

export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    const idx = members.findIndex((cm) => cm.conversation_id === conversationId && cm.user_id === userId);
    if (idx >= 0) {
      members[idx] = { ...members[idx], last_read_at: new Date().toISOString() };
      setStoredMembers(members);
    }
    return;
  }
  const client = createClient();
  if (!client) return;
  await client
    .from('conversation_members')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);
}

// ============================================================
// Message Sending
// ============================================================

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  if (!isSupabaseConfigured()) {
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

    await markConversationRead(conversationId, senderId);

    const convMembers = getStoredMembers().filter((cm) => cm.conversation_id === conversationId);
    const senderName = await getUserFirstName(senderId);
    for (const member of convMembers) {
      if (member.user_id !== senderId) {
        notifyNewMessage(senderName, conversationId, content);
      }
    }

    return newMessage;
  }

  const client = createClient();
  if (!client) throw new Error('Supabase is not configured.');

  const { data: newMessage, error } = await client
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content, message_type: 'text' })
    .select('*')
    .single();
  if (error || !newMessage) throw error ?? new Error('Failed to send message.');

  await client
    .from('conversations')
    .update({ last_message_at: newMessage.created_at, updated_at: newMessage.created_at })
    .eq('id', conversationId);

  await markConversationRead(conversationId, senderId);

  const { data: convMembers } = await client
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId);
  const senderName = await getUserFirstName(senderId);
  for (const member of convMembers ?? []) {
    if (member.user_id !== senderId) {
      notifyNewMessage(senderName, conversationId, content);
    }
  }

  return newMessage as Message;
}

// ============================================================
// Conversation Creation
// ============================================================

export async function findDirectConversation(userId1: string, userId2: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    const conversations = getStoredConversations();
    const members = getStoredMembers();
    for (const conv of conversations) {
      if (conv.type !== 'direct') continue;
      const convMembers = members.filter((cm) => cm.conversation_id === conv.id);
      const hasUser1 = convMembers.some((cm) => cm.user_id === userId1);
      const hasUser2 = convMembers.some((cm) => cm.user_id === userId2);
      if (hasUser1 && hasUser2 && convMembers.length === 2) return conv;
    }
    return null;
  }

  const client = createClient();
  if (!client) return null;
  const { data: mine } = await client.from('conversation_members').select('conversation_id').eq('user_id', userId1);
  const myConvIds = (mine ?? []).map((m) => m.conversation_id);
  if (myConvIds.length === 0) return null;

  const { data: shared } = await client
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId2)
    .in('conversation_id', myConvIds);
  const sharedIds = (shared ?? []).map((m) => m.conversation_id);
  if (sharedIds.length === 0) return null;

  const { data: direct } = await client
    .from('conversations')
    .select('*')
    .in('id', sharedIds)
    .eq('type', 'direct');
  return (direct as Conversation[] | null)?.[0] ?? null;
}

export async function createDirectConversation(userId1: string, userId2: string): Promise<Conversation> {
  const existing = await findDirectConversation(userId1, userId2);
  if (existing) return existing;

  if (!isSupabaseConfigured()) {
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

    const members = getStoredMembers();
    members.push(
      { id: `cm-${Date.now()}-1`, conversation_id: convId, user_id: userId1, joined_at: now, last_read_at: now, is_muted: false },
      { id: `cm-${Date.now()}-2`, conversation_id: convId, user_id: userId2, joined_at: now, last_read_at: now, is_muted: false }
    );
    setStoredMembers(members);
    return newConv;
  }

  const client = createClient();
  if (!client) throw new Error('Supabase is not configured.');

  const { data: newConv, error } = await client
    .from('conversations')
    .insert({ type: 'direct', created_by: userId1 })
    .select('*')
    .single();
  if (error || !newConv) throw error ?? new Error('Failed to create conversation.');

  const now = new Date().toISOString();
  await client.from('conversation_members').insert([
    { conversation_id: newConv.id, user_id: userId1, joined_at: now },
    { conversation_id: newConv.id, user_id: userId2, joined_at: now },
  ]);

  return newConv as Conversation;
}

// ============================================================
// Leave Conversation
// ============================================================

export async function leaveConversation(conversationId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const members = getStoredMembers();
    const filtered = members.filter((cm) => !(cm.conversation_id === conversationId && cm.user_id === userId));
    setStoredMembers(filtered);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('conversation_members').delete().eq('conversation_id', conversationId).eq('user_id', userId);
}

// ============================================================
// User display helpers
// ============================================================

export function getOtherUserInDirectFromMembers(
  members: ConversationMember[],
  currentUserId: string
): string | null {
  return members.find((cm) => cm.user_id !== currentUserId)?.user_id || null;
}

export async function getOtherUserInDirect(conversationId: string, currentUserId: string): Promise<string | null> {
  const members = await getConversationMembersList(conversationId);
  return getOtherUserInDirectFromMembers(members, currentUserId);
}

export async function getUserDisplayName(userId: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    const student = mockStudents.find((s) => s.user_id === userId || s.id === userId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown User';
  }
  const client = createClient();
  if (!client) return 'Unknown User';
  const { data } = await client.from('profiles').select('first_name,last_name').eq('user_id', userId).maybeSingle();
  return data ? `${data.first_name} ${data.last_name}` : 'Unknown User';
}

export async function getUserFirstName(userId: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    const student = mockStudents.find((s) => s.user_id === userId || s.id === userId);
    return student?.first_name ?? 'Unknown';
  }
  const client = createClient();
  if (!client) return 'Unknown';
  const { data } = await client.from('profiles').select('first_name').eq('user_id', userId).maybeSingle();
  return data?.first_name ?? 'Unknown';
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
