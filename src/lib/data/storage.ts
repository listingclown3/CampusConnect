'use client';

import type { Conversation, ConversationMember, Message } from '@/types/database';
import {
  mockConversations,
  mockConversationMembers,
  mockMessages,
} from '@/lib/mock-data/conversations';

// ============================================================
// Centralized localStorage key registry
// All chat-related keys are defined here to prevent duplication
// and ensure consistent access across modules (realtime.ts,
// pod-actions.ts, event-actions.ts).
// ============================================================

export const STORAGE_KEYS = {
  CONVERSATIONS: 'spartancircle_conversations',
  CONVERSATION_MEMBERS: 'spartancircle_conversation_members',
  MESSAGES: 'spartancircle_messages',
  BLOCKS: 'spartancircle_blocks',
  POD_MEMBERS: 'spartancircle_pod_members',
  EVENT_RSVPS: 'spartancircle_event_rsvps',
  CLUB_MEMBERS: 'spartancircle_club_members',
  SAVED_MATCHES: 'spartancircle_saved_matches',
  SKIPPED_MATCHES: 'spartancircle_skipped_matches',
  ONBOARDING_PROGRESS: 'spartancircle_onboarding_progress',
} as const;

// ============================================================
// Conversations
// ============================================================

export function getStoredConversations(): Conversation[] {
  if (typeof window === 'undefined') return mockConversations;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(mockConversations));
  return [...mockConversations];
}

export function setStoredConversations(convos: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convos));
}

// ============================================================
// Conversation Members
// ============================================================

export function getStoredMembers(): ConversationMember[] {
  if (typeof window === 'undefined') return mockConversationMembers;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATION_MEMBERS);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  localStorage.setItem(STORAGE_KEYS.CONVERSATION_MEMBERS, JSON.stringify(mockConversationMembers));
  return [...mockConversationMembers];
}

export function setStoredMembers(members: ConversationMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CONVERSATION_MEMBERS, JSON.stringify(members));
}

// ============================================================
// Messages
// ============================================================

export function getStoredMessages(): Message[] {
  if (typeof window === 'undefined') return mockMessages;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(mockMessages));
  return [...mockMessages];
}

export function setStoredMessages(messages: Message[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}
