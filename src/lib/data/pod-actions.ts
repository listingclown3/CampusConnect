'use client';

import type { PodMember, Conversation, ConversationMember } from '@/types/database';
import { mockPodMembers } from '@/lib/mock-data/pods';

// ============================================================
// localStorage keys
// ============================================================
const POD_MEMBERS_KEY = 'spartancircle_pod_members';
const CONVERSATIONS_KEY = 'spartancircle_conversations';
const CONV_MEMBERS_KEY = 'spartancircle_conversation_members';

// ============================================================
// Pod Members Storage
// ============================================================

export function getStoredPodMembers(): PodMember[] {
  if (typeof window === 'undefined') return mockPodMembers;
  try {
    const stored = localStorage.getItem(POD_MEMBERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  localStorage.setItem(POD_MEMBERS_KEY, JSON.stringify(mockPodMembers));
  return [...mockPodMembers];
}

function setStoredPodMembers(members: PodMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POD_MEMBERS_KEY, JSON.stringify(members));
}

// ============================================================
// Conversation Storage (shared with chat system)
// ============================================================

function getStoredConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredConversations(convos: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convos));
}

function getStoredConvMembers(): ConversationMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONV_MEMBERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredConvMembers(members: ConversationMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONV_MEMBERS_KEY, JSON.stringify(members));
}

// ============================================================
// Pod Membership Actions
// ============================================================

export function getPodMembersForPod(podId: string): PodMember[] {
  const members = getStoredPodMembers();
  return members.filter((pm) => pm.pod_id === podId);
}

export function isUserInPod(podId: string, userId: string): boolean {
  const members = getStoredPodMembers();
  return members.some((pm) => pm.pod_id === podId && pm.user_id === userId);
}

export function getUserPodIds(userId: string): string[] {
  const members = getStoredPodMembers();
  return members.filter((pm) => pm.user_id === userId).map((pm) => pm.pod_id);
}

export function getPodMemberCount(podId: string): number {
  const members = getStoredPodMembers();
  return members.filter((pm) => pm.pod_id === podId).length;
}

export function joinPod(podId: string, userId: string): boolean {
  const members = getStoredPodMembers();

  // Check if already a member
  if (members.some((pm) => pm.pod_id === podId && pm.user_id === userId)) {
    return false;
  }

  // Check if pod is full (max 5)
  const podMemberCount = members.filter((pm) => pm.pod_id === podId).length;
  if (podMemberCount >= 5) {
    return false;
  }

  const now = new Date().toISOString();
  const newMember: PodMember = {
    id: `pm-${podId}-${userId}`,
    pod_id: podId,
    user_id: userId,
    role: 'member',
    joined_at: now,
  };

  members.push(newMember);
  setStoredPodMembers(members);

  // Also add user to the pod's conversation
  addUserToPodConversation(podId, userId);

  return true;
}

export function leavePod(podId: string, userId: string): boolean {
  const members = getStoredPodMembers();
  const filtered = members.filter(
    (pm) => !(pm.pod_id === podId && pm.user_id === userId)
  );

  if (filtered.length === members.length) {
    return false; // User was not in the pod
  }

  setStoredPodMembers(filtered);

  // Remove user from the pod's conversation
  removeUserFromPodConversation(podId, userId);

  return true;
}

// ============================================================
// Pod Conversation Integration
// ============================================================

export function findPodConversation(podId: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations.find((c) => c.type === 'pod' && c.pod_id === podId) || null;
}

export function getOrCreatePodConversation(podId: string, podName: string, creatorId: string): Conversation {
  const existing = findPodConversation(podId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const convId = `conv-pod-${podId}-${Date.now()}`;

  const newConv: Conversation = {
    id: convId,
    type: 'pod',
    name: podName,
    pod_id: podId,
    event_id: null,
    created_by: creatorId,
    last_message_at: null,
    created_at: now,
    updated_at: now,
  };

  const conversations = getStoredConversations();
  conversations.push(newConv);
  setStoredConversations(conversations);

  return newConv;
}

function addUserToPodConversation(podId: string, userId: string): void {
  const conv = findPodConversation(podId);
  if (!conv) return;

  const members = getStoredConvMembers();

  // Check if already a member
  if (members.some((cm) => cm.conversation_id === conv.id && cm.user_id === userId)) {
    return;
  }

  const now = new Date().toISOString();
  members.push({
    id: `cm-${conv.id}-${userId}-${Date.now()}`,
    conversation_id: conv.id,
    user_id: userId,
    joined_at: now,
    last_read_at: now,
    is_muted: false,
  });

  setStoredConvMembers(members);
}

function removeUserFromPodConversation(podId: string, userId: string): void {
  const conv = findPodConversation(podId);
  if (!conv) return;

  const members = getStoredConvMembers();
  const filtered = members.filter(
    (cm) => !(cm.conversation_id === conv.id && cm.user_id === userId)
  );
  setStoredConvMembers(filtered);
}
