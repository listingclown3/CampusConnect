import { isSupabaseConfigured } from '@/lib/supabase/server';
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
 * When configured, queries Supabase.
 */

function shouldUseMockData(): boolean {
  return !isSupabaseConfigured();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (shouldUseMockData()) {
    return mockData.getStudentById(userId) ?? null;
  }
  // TODO: Query Supabase
  return null;
}

export async function getProfiles(): Promise<Profile[]> {
  if (shouldUseMockData()) {
    return mockData.getStudents();
  }
  return [];
}

export async function getMatches(userId: string): Promise<Profile[]> {
  if (shouldUseMockData()) {
    // Return all other visible students as potential matches
    return mockData
      .getStudents()
      .filter((s) => s.user_id !== userId && s.is_visible);
  }
  return [];
}

export async function getClasses(): Promise<Class[]> {
  if (shouldUseMockData()) {
    return mockData.getClasses();
  }
  return [];
}

export async function getClassById(id: string): Promise<Class | null> {
  if (shouldUseMockData()) {
    return mockData.getClassById(id) ?? null;
  }
  return null;
}

export async function getClubs(): Promise<Club[]> {
  if (shouldUseMockData()) {
    return mockData.getClubs();
  }
  return [];
}

export async function getClubById(id: string): Promise<Club | null> {
  if (shouldUseMockData()) {
    return mockData.getClubById(id) ?? null;
  }
  return null;
}

export async function getEvents(): Promise<Event[]> {
  if (shouldUseMockData()) {
    return mockData.getEvents();
  }
  return [];
}

export async function getEventById(id: string): Promise<Event | null> {
  if (shouldUseMockData()) {
    return mockData.getEventById(id) ?? null;
  }
  return null;
}

export async function getPods(): Promise<Pod[]> {
  if (shouldUseMockData()) {
    return mockData.getPods();
  }
  return [];
}

export async function getPodById(id: string): Promise<Pod | null> {
  if (shouldUseMockData()) {
    return mockData.getPodById(id) ?? null;
  }
  return null;
}

export async function getPodMembers(podId: string): Promise<PodMember[]> {
  if (shouldUseMockData()) {
    return mockData.getPodMembers(podId);
  }
  return [];
}

export async function getUserPods(userId: string): Promise<Pod[]> {
  if (shouldUseMockData()) {
    return mockData.getUserPods(userId);
  }
  return [];
}

export async function getConversations(
  userId: string
): Promise<Conversation[]> {
  if (shouldUseMockData()) {
    return mockData.getUserConversations(userId);
  }
  return [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (shouldUseMockData()) {
    return mockData.getMessages(conversationId);
  }
  return [];
}
