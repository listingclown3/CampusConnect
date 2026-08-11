'use client';

import type { PodMember, Conversation } from '@/types/database';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { mockPodMembers } from '@/lib/mock-data/pods';
import {
  getStoredConversations,
  setStoredConversations,
  getStoredMembers as getStoredConvMembers,
  setStoredMembers as setStoredConvMembers,
  STORAGE_KEYS,
} from '@/lib/data/storage';

// ============================================================
// Pod Members Storage (mock mode only)
// ============================================================

export function getStoredPodMembers(): PodMember[] {
  if (typeof window === 'undefined') return mockPodMembers;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POD_MEMBERS);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  localStorage.setItem(STORAGE_KEYS.POD_MEMBERS, JSON.stringify(mockPodMembers));
  return [...mockPodMembers];
}

function setStoredPodMembers(members: PodMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.POD_MEMBERS, JSON.stringify(members));
}

// ============================================================
// Pod Membership Actions
// ============================================================

export async function getPodMembersForPod(podId: string): Promise<PodMember[]> {
  if (!isSupabaseConfigured()) {
    const members = getStoredPodMembers();
    return members.filter((pm) => pm.pod_id === podId);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('pod_members').select('*').eq('pod_id', podId);
  return (data as PodMember[]) ?? [];
}

export async function isUserInPod(podId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const members = getStoredPodMembers();
    return members.some((pm) => pm.pod_id === podId && pm.user_id === userId);
  }
  const client = createClient();
  if (!client) return false;
  const { data } = await client
    .from('pod_members')
    .select('id')
    .eq('pod_id', podId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}

export async function getUserPodIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const members = getStoredPodMembers();
    return members.filter((pm) => pm.user_id === userId).map((pm) => pm.pod_id);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('pod_members').select('pod_id').eq('user_id', userId);
  return (data ?? []).map((row) => row.pod_id);
}

export async function getPodMemberCount(podId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    const members = getStoredPodMembers();
    return members.filter((pm) => pm.pod_id === podId).length;
  }
  const client = createClient();
  if (!client) return 0;
  const { count } = await client
    .from('pod_members')
    .select('id', { count: 'exact', head: true })
    .eq('pod_id', podId);
  return count ?? 0;
}

export async function joinPod(podId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
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
    await addUserToPodConversation(podId, userId);

    return true;
  }

  const client = createClient();
  if (!client) return false;

  const alreadyMember = await isUserInPod(podId, userId);
  if (alreadyMember) return false;

  const { data: pod } = await client.from('pods').select('max_members').eq('id', podId).maybeSingle();
  const maxMembers = pod?.max_members ?? 5;
  const memberCount = await getPodMemberCount(podId);
  if (memberCount >= maxMembers) return false;

  const { error } = await client
    .from('pod_members')
    .insert({ pod_id: podId, user_id: userId, role: 'member' });
  if (error) return false;

  await addUserToPodConversation(podId, userId);

  return true;
}

export async function leavePod(podId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const members = getStoredPodMembers();
    const filtered = members.filter(
      (pm) => !(pm.pod_id === podId && pm.user_id === userId)
    );

    if (filtered.length === members.length) {
      return false; // User was not in the pod
    }

    setStoredPodMembers(filtered);

    // Remove user from the pod's conversation
    await removeUserFromPodConversation(podId, userId);

    return true;
  }

  const client = createClient();
  if (!client) return false;

  const { data } = await client
    .from('pod_members')
    .delete()
    .eq('pod_id', podId)
    .eq('user_id', userId)
    .select('id');
  if (!data || data.length === 0) return false;

  await removeUserFromPodConversation(podId, userId);

  return true;
}

// ============================================================
// Pod Conversation Integration
// ============================================================

export async function findPodConversation(podId: string): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) {
    const conversations = getStoredConversations();
    return conversations.find((c) => c.type === 'pod' && c.pod_id === podId) || null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client
    .from('conversations')
    .select('*')
    .eq('type', 'pod')
    .eq('pod_id', podId)
    .maybeSingle();
  return data as Conversation | null;
}

export async function getOrCreatePodConversation(
  podId: string,
  podName: string,
  creatorId: string
): Promise<Conversation> {
  const existing = await findPodConversation(podId);
  if (existing) return existing;

  if (!isSupabaseConfigured()) {
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

  const client = createClient();
  if (!client) throw new Error('Supabase is not configured.');

  const { data: newConv, error } = await client
    .from('conversations')
    .insert({ type: 'pod', name: podName, pod_id: podId, created_by: creatorId })
    .select('*')
    .single();
  if (error || !newConv) throw error ?? new Error('Failed to create pod conversation.');

  const members = await getPodMembersForPod(podId);
  const now = new Date().toISOString();
  // Creator's own membership row must be inserted first so the RLS check on
  // the following rows ("EXISTS a conversation_members row for auth.uid()")
  // has something to find — mirrors chat/realtime.ts's createDirectConversation.
  const otherMemberIds = members.map((m) => m.user_id).filter((id) => id !== creatorId);
  const rows = [
    { conversation_id: newConv.id, user_id: creatorId, joined_at: now },
    ...otherMemberIds.map((user_id) => ({ conversation_id: newConv.id, user_id, joined_at: now })),
  ];
  await client.from('conversation_members').insert(rows);

  return newConv as Conversation;
}

async function addUserToPodConversation(podId: string, userId: string): Promise<void> {
  const conv = await findPodConversation(podId);
  if (!conv) return;

  if (!isSupabaseConfigured()) {
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
    return;
  }

  const client = createClient();
  if (!client) return;
  const { data: existing } = await client
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conv.id)
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) return;

  await client
    .from('conversation_members')
    .insert({ conversation_id: conv.id, user_id: userId, joined_at: new Date().toISOString() });
}

async function removeUserFromPodConversation(podId: string, userId: string): Promise<void> {
  const conv = await findPodConversation(podId);
  if (!conv) return;

  if (!isSupabaseConfigured()) {
    const members = getStoredConvMembers();
    const filtered = members.filter(
      (cm) => !(cm.conversation_id === conv.id && cm.user_id === userId)
    );
    setStoredConvMembers(filtered);
    return;
  }

  const client = createClient();
  if (!client) return;
  await client
    .from('conversation_members')
    .delete()
    .eq('conversation_id', conv.id)
    .eq('user_id', userId);
}
