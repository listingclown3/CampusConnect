import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import * as mockData from '@/lib/mock-data';
import type {
  Profile,
  Class,
  Club,
  Event,
  Pod,
  PodMember,
  Conversation,
  Message,
} from '@/types/database';

/**
 * Data access layer that abstracts between Supabase and mock data.
 * When Supabase is not configured (no env vars), returns mock data.
 * When configured, queries Supabase. RLS policies (see
 * supabase/migrations/002_rls_policies.sql) do the actual access control
 * here — these functions rely on the caller's session, not service-role
 * privileges.
 */

function shouldUseMockData(): boolean {
  return !isSupabaseConfigured();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (shouldUseMockData()) {
    return mockData.getStudentById(userId) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  return data as Profile | null;
}

export async function getProfiles(): Promise<Profile[]> {
  if (shouldUseMockData()) {
    return mockData.getStudents();
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('profiles').select('*');
  return (data as Profile[]) ?? [];
}

export async function getMatches(userId: string): Promise<Profile[]> {
  if (shouldUseMockData()) {
    // Return all other visible students as potential matches
    return mockData
      .getStudents()
      .filter((s) => s.user_id !== userId && s.is_visible);
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_visible', true)
    .neq('user_id', userId);
  return (data as Profile[]) ?? [];
}

export async function getClasses(): Promise<Class[]> {
  if (shouldUseMockData()) {
    return mockData.getClasses();
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('classes').select('*').order('course_code');
  return (data as Class[]) ?? [];
}

export async function getClassById(id: string): Promise<Class | null> {
  if (shouldUseMockData()) {
    return mockData.getClassById(id) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('classes').select('*').eq('id', id).maybeSingle();
  return data as Class | null;
}

export async function getClubs(): Promise<Club[]> {
  if (shouldUseMockData()) {
    return mockData.getClubs();
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('clubs').select('*');
  return (data as Club[]) ?? [];
}

export async function getClubById(id: string): Promise<Club | null> {
  if (shouldUseMockData()) {
    return mockData.getClubById(id) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('clubs').select('*').eq('id', id).maybeSingle();
  return data as Club | null;
}

export async function getEvents(): Promise<Event[]> {
  if (shouldUseMockData()) {
    return mockData.getEvents();
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('events').select('*').order('start_time');
  return (data as Event[]) ?? [];
}

export async function getEventById(id: string): Promise<Event | null> {
  if (shouldUseMockData()) {
    return mockData.getEventById(id) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  return data as Event | null;
}

export async function getPods(): Promise<Pod[]> {
  if (shouldUseMockData()) {
    return mockData.getPods();
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('pods').select('*').eq('is_active', true);
  return (data as Pod[]) ?? [];
}

export async function getPodById(id: string): Promise<Pod | null> {
  if (shouldUseMockData()) {
    return mockData.getPodById(id) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('pods').select('*').eq('id', id).maybeSingle();
  return data as Pod | null;
}

export async function getPodMembers(podId: string): Promise<PodMember[]> {
  if (shouldUseMockData()) {
    return mockData.getPodMembers(podId);
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from('pod_members').select('*').eq('pod_id', podId);
  return (data as PodMember[]) ?? [];
}

export async function getUserPods(userId: string): Promise<Pod[]> {
  if (shouldUseMockData()) {
    return mockData.getUserPods(userId);
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data: memberships } = await supabase
    .from('pod_members')
    .select('pod_id')
    .eq('user_id', userId);
  const podIds = (memberships ?? []).map((m) => m.pod_id);
  if (podIds.length === 0) return [];
  const { data } = await supabase.from('pods').select('*').in('id', podIds);
  return (data as Pod[]) ?? [];
}

export async function getConversations(
  userId: string
): Promise<Conversation[]> {
  if (shouldUseMockData()) {
    return mockData.getUserConversations(userId);
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data: memberships } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId);
  const conversationIds = (memberships ?? []).map((m) => m.conversation_id);
  if (conversationIds.length === 0) return [];
  const { data } = await supabase
    .from('conversations')
    .select('*')
    .in('id', conversationIds)
    .order('last_message_at', { ascending: false });
  return (data as Conversation[]) ?? [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (shouldUseMockData()) {
    return mockData.getMessages(conversationId);
  }
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return (data as Message[]) ?? [];
}
