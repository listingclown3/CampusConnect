'use client';

import type { EventRsvp, RsvpStatus, Conversation } from '@/types/database';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import {
  getStoredConversations,
  setStoredConversations,
  getStoredMembers as getStoredConvMembers,
  setStoredMembers as setStoredConvMembers,
  STORAGE_KEYS,
} from '@/lib/data/storage';
import { notifyStorageChange } from '@/lib/storage-sync';

// ============================================================
// RSVP Storage
// ============================================================

function getStoredRsvps(): EventRsvp[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENT_RSVPS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredRsvps(rsvps: EventRsvp[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EVENT_RSVPS, JSON.stringify(rsvps));
  notifyStorageChange();
}

// ============================================================
// RSVP Actions
// ============================================================

export async function getRsvpStatus(eventId: string, userId: string): Promise<RsvpStatus | null> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    const rsvp = rsvps.find((r) => r.event_id === eventId && r.user_id === userId);
    return rsvp?.status ?? null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client
    .from('event_rsvps')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();
  return (data?.status as RsvpStatus | undefined) ?? null;
}

export async function setRsvpStatus(eventId: string, userId: string, status: RsvpStatus): Promise<void> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    const existingIdx = rsvps.findIndex(
      (r) => r.event_id === eventId && r.user_id === userId
    );
    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      rsvps[existingIdx] = {
        ...rsvps[existingIdx],
        status,
        updated_at: now,
      };
    } else {
      rsvps.push({
        id: `rsvp-${eventId}-${userId}`,
        event_id: eventId,
        user_id: userId,
        status,
        created_at: now,
        updated_at: now,
      });
    }

    setStoredRsvps(rsvps);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client
    .from('event_rsvps')
    .upsert({ event_id: eventId, user_id: userId, status }, { onConflict: 'event_id,user_id' });
}

export async function removeRsvp(eventId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    const filtered = rsvps.filter(
      (r) => !(r.event_id === eventId && r.user_id === userId)
    );
    setStoredRsvps(filtered);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('event_rsvps').delete().eq('event_id', eventId).eq('user_id', userId);
}

export async function getEventRsvps(eventId: string): Promise<EventRsvp[]> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    return rsvps.filter((r) => r.event_id === eventId);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('event_rsvps').select('*').eq('event_id', eventId);
  return (data as EventRsvp[]) ?? [];
}

export async function getEventAttendees(eventId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    return rsvps
      .filter((r) => r.event_id === eventId && r.status === 'going')
      .map((r) => r.user_id);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client
    .from('event_rsvps')
    .select('user_id')
    .eq('event_id', eventId)
    .eq('status', 'going');
  return (data ?? []).map((row) => row.user_id);
}

export async function getEventInterestedCount(eventId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    return rsvps.filter(
      (r) => r.event_id === eventId && (r.status === 'going' || r.status === 'interested')
    ).length;
  }
  const client = createClient();
  if (!client) return 0;
  const { count } = await client
    .from('event_rsvps')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .in('status', ['going', 'interested']);
  return count ?? 0;
}

export async function getAttendingMap(): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured()) {
    const rsvps = getStoredRsvps();
    const map: Record<string, string[]> = {};
    for (const rsvp of rsvps) {
      if (rsvp.status === 'going') {
        if (!map[rsvp.event_id]) map[rsvp.event_id] = [];
        map[rsvp.event_id].push(rsvp.user_id);
      }
    }
    return map;
  }
  const client = createClient();
  if (!client) return {};
  const { data } = await client.from('event_rsvps').select('event_id,user_id').eq('status', 'going');
  const map: Record<string, string[]> = {};
  for (const row of data ?? []) {
    (map[row.event_id] ??= []).push(row.user_id);
  }
  return map;
}

// ============================================================
// Event Conversation Integration
// (Uses shared storage accessors from @/lib/data/storage)
// ============================================================

export async function findEventConversation(eventId: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    const conversations = getStoredConversations();
    return conversations.find((c) => c.type === 'event' && c.event_id === eventId) || null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client
    .from('conversations')
    .select('*')
    .eq('type', 'event')
    .eq('event_id', eventId)
    .maybeSingle();
  return data as Conversation | null;
}

export async function getOrCreateEventConversation(
  eventId: string,
  eventTitle: string,
  userId: string
): Promise<Conversation> {
  const existing = await findEventConversation(eventId);

  if (!isSupabaseConfigured()) {
    if (existing) {
      // Ensure user is a member
      addUserToEventConversation(existing.id, userId);
      return existing;
    }

    const now = new Date().toISOString();
    const convId = `conv-event-${eventId}-${Date.now()}`;

    const newConv: Conversation = {
      id: convId,
      type: 'event',
      name: eventTitle,
      pod_id: null,
      event_id: eventId,
      created_by: userId,
      last_message_at: null,
      created_at: now,
      updated_at: now,
    };

    const conversations = getStoredConversations();
    conversations.push(newConv);
    setStoredConversations(conversations);

    // Add creator as member
    addUserToEventConversation(convId, userId);

    return newConv;
  }

  const client = createClient();
  if (!client) throw new Error('Supabase is not configured.');

  if (existing) {
    // Ensure user is a member of the event conversation
    await client
      .from('conversation_members')
      .upsert(
        { conversation_id: existing.id, user_id: userId, joined_at: new Date().toISOString() },
        { onConflict: 'conversation_id,user_id', ignoreDuplicates: true }
      );
    return existing;
  }

  const { data: newConv, error } = await client
    .from('conversations')
    .insert({ type: 'event', name: eventTitle, event_id: eventId, created_by: userId })
    .select('*')
    .single();
  if (error || !newConv) throw error ?? new Error('Failed to create event conversation.');

  // Members = current event attendees (not just the creator), matching the
  // "everyone going to this event is in the chat" mock-mode expectation.
  const attendeeIds = await getEventAttendees(eventId);
  const memberIds = new Set<string>([userId, ...attendeeIds]);
  const now = new Date().toISOString();
  await client.from('conversation_members').insert(
    Array.from(memberIds).map((user_id) => ({ conversation_id: newConv.id, user_id, joined_at: now }))
  );

  return newConv as Conversation;
}

function addUserToEventConversation(conversationId: string, userId: string): void {
  const members = getStoredConvMembers();

  // Check if already a member
  if (members.some((cm) => cm.conversation_id === conversationId && cm.user_id === userId)) {
    return;
  }

  const now = new Date().toISOString();
  members.push({
    id: `cm-${conversationId}-${userId}-${Date.now()}`,
    conversation_id: conversationId,
    user_id: userId,
    joined_at: now,
    last_read_at: now,
    is_muted: false,
  });

  setStoredConvMembers(members);
}

// ============================================================
// Club Membership
// ============================================================

interface ClubMembership {
  club_id: string;
  user_id: string;
  joined_at: string;
}

function getStoredClubMembers(): ClubMembership[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLUB_MEMBERS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredClubMembers(members: ClubMembership[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CLUB_MEMBERS, JSON.stringify(members));
}

export async function isUserInClub(clubId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const members = getStoredClubMembers();
    return members.some((m) => m.club_id === clubId && m.user_id === userId);
  }
  const client = createClient();
  if (!client) return false;
  const { data } = await client
    .from('club_members')
    .select('id')
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}

export async function joinClub(clubId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const members = getStoredClubMembers();
    if (members.some((m) => m.club_id === clubId && m.user_id === userId)) return;
    members.push({
      club_id: clubId,
      user_id: userId,
      joined_at: new Date().toISOString(),
    });
    setStoredClubMembers(members);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client
    .from('club_members')
    .upsert({ club_id: clubId, user_id: userId }, { onConflict: 'club_id,user_id', ignoreDuplicates: true });
}

export async function leaveClub(clubId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const members = getStoredClubMembers();
    const filtered = members.filter(
      (m) => !(m.club_id === clubId && m.user_id === userId)
    );
    setStoredClubMembers(filtered);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('club_members').delete().eq('club_id', clubId).eq('user_id', userId);
}

export async function getClubMemberCount(clubId: string, baseMemberCount: number): Promise<number> {
  if (!isSupabaseConfigured()) {
    const members = getStoredClubMembers();
    const extraMembers = members.filter((m) => m.club_id === clubId).length;
    return baseMemberCount + extraMembers;
  }
  const client = createClient();
  if (!client) return baseMemberCount;
  const { count } = await client
    .from('club_members')
    .select('id', { count: 'exact', head: true })
    .eq('club_id', clubId);
  return baseMemberCount + (count ?? 0);
}
