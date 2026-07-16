'use client';

import type { EventRsvp, RsvpStatus, Conversation } from '@/types/database';
import {
  getStoredConversations,
  setStoredConversations,
  getStoredMembers as getStoredConvMembers,
  setStoredMembers as setStoredConvMembers,
  STORAGE_KEYS,
} from '@/lib/data/storage';

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
}

// ============================================================
// RSVP Actions
// ============================================================

export function getRsvpStatus(eventId: string, userId: string): RsvpStatus | null {
  const rsvps = getStoredRsvps();
  const rsvp = rsvps.find((r) => r.event_id === eventId && r.user_id === userId);
  return rsvp?.status ?? null;
}

export function setRsvpStatus(eventId: string, userId: string, status: RsvpStatus): void {
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
}

export function removeRsvp(eventId: string, userId: string): void {
  const rsvps = getStoredRsvps();
  const filtered = rsvps.filter(
    (r) => !(r.event_id === eventId && r.user_id === userId)
  );
  setStoredRsvps(filtered);
}

export function getEventRsvps(eventId: string): EventRsvp[] {
  const rsvps = getStoredRsvps();
  return rsvps.filter((r) => r.event_id === eventId);
}

export function getEventAttendees(eventId: string): string[] {
  const rsvps = getStoredRsvps();
  return rsvps
    .filter((r) => r.event_id === eventId && r.status === 'going')
    .map((r) => r.user_id);
}

export function getEventInterestedCount(eventId: string): number {
  const rsvps = getStoredRsvps();
  return rsvps.filter(
    (r) => r.event_id === eventId && (r.status === 'going' || r.status === 'interested')
  ).length;
}

export function getAttendingMap(): Record<string, string[]> {
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

// ============================================================
// Event Conversation Integration
// (Uses shared storage accessors from @/lib/data/storage)
// ============================================================

export function findEventConversation(eventId: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations.find((c) => c.type === 'event' && c.event_id === eventId) || null;
}

export function getOrCreateEventConversation(
  eventId: string,
  eventTitle: string,
  userId: string
): Conversation {
  const existing = findEventConversation(eventId);
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

export function isUserInClub(clubId: string, userId: string): boolean {
  const members = getStoredClubMembers();
  return members.some((m) => m.club_id === clubId && m.user_id === userId);
}

export function joinClub(clubId: string, userId: string): void {
  const members = getStoredClubMembers();
  if (members.some((m) => m.club_id === clubId && m.user_id === userId)) return;
  members.push({
    club_id: clubId,
    user_id: userId,
    joined_at: new Date().toISOString(),
  });
  setStoredClubMembers(members);
}

export function leaveClub(clubId: string, userId: string): void {
  const members = getStoredClubMembers();
  const filtered = members.filter(
    (m) => !(m.club_id === clubId && m.user_id === userId)
  );
  setStoredClubMembers(filtered);
}

export function getClubMemberCount(clubId: string, baseMemberCount: number): number {
  const members = getStoredClubMembers();
  const extraMembers = members.filter((m) => m.club_id === clubId).length;
  return baseMemberCount + extraMembers;
}
