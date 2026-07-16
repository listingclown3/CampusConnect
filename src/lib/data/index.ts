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

function useMockData(): boolean {
  return !isSupabaseConfigured();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (useMockData()) {
    return mockData.getStudentById(userId) ?? null;
  }
  // TODO: Query Supabase
  return null;
}

export async function getProfiles(): Promise<Profile[]> {
  if (useMockData()) {
    return mockData.getStudents();
  }
  return [];
}

export async function getMatches(userId: string): Promise<Profile[]> {
  if (useMockData()) {
    // Return all other visible students as potential matches
    return mockData
      .getStudents()
      .filter((s) => s.user_id !== userId && s.is_visible);
  }
  return [];
}

export async function getClasses(): Promise<Class[]> {
  if (useMockData()) {
    return mockData.getClasses();
  }
  return [];
}

export async function getClassById(id: string): Promise<Class | null> {
  if (useMockData()) {
    return mockData.getClassById(id) ?? null;
  }
  return null;
}

export async function getClubs(): Promise<Club[]> {
  if (useMockData()) {
    return mockData.getClubs();
  }
  return [];
}

export async function getClubById(id: string): Promise<Club | null> {
  if (useMockData()) {
    return mockData.getClubById(id) ?? null;
  }
  return null;
}

export async function getEvents(): Promise<Event[]> {
  if (useMockData()) {
    return mockData.getEvents();
  }
  return [];
}

export async function getEventById(id: string): Promise<Event | null> {
  if (useMockData()) {
    return mockData.getEventById(id) ?? null;
  }
  return null;
}

export async function getPods(): Promise<Pod[]> {
  if (useMockData()) {
    return mockData.getPods();
  }
  return [];
}

export async function getPodById(id: string): Promise<Pod | null> {
  if (useMockData()) {
    return mockData.getPodById(id) ?? null;
  }
  return null;
}

export async function getPodMembers(podId: string): Promise<PodMember[]> {
  if (useMockData()) {
    return mockData.getPodMembers(podId);
  }
  return [];
}

export async function getUserPods(userId: string): Promise<Pod[]> {
  if (useMockData()) {
    return mockData.getUserPods(userId);
  }
  return [];
}

export async function getConversations(
  userId: string
): Promise<Conversation[]> {
  if (useMockData()) {
    return mockData.getUserConversations(userId);
  }
  return [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (useMockData()) {
    return mockData.getMessages(conversationId);
  }
  return [];
}
