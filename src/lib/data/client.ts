'use client';

import type { Class, Club, Event, Pod, PodMember, Profile } from '@/types/database';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import * as mockData from '@/lib/mock-data';
import { getStoredUserClasses, setStoredUserClasses } from './storage';

/**
 * Client-component-safe counterpart to src/lib/data/index.ts. That file
 * uses the cookie-based server Supabase client and can only run in server
 * components; several pages (matches, dashboard, campus, events) are
 * client components that filter/sort interactively, so they need a
 * browser-client version of the same mock/real split instead of importing
 * @/lib/mock-data directly (which is what they were doing — meaning they
 * silently never left mock data even once Supabase was configured).
 */

export async function getVisibleProfiles(excludeUserId: string): Promise<Profile[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getStudents().filter((s) => s.user_id !== excludeUserId && s.is_visible);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('is_visible', true)
    .neq('user_id', excludeUserId);
  return (data as Profile[]) ?? [];
}

/** Single profile lookup by user_id — used by match-detail pages that need
 * one specific profile rather than the full visible list. */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return mockData.getStudentById(userId) ?? null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  return data as Profile | null;
}

export async function getAllClasses(): Promise<Class[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getClasses();
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('classes').select('*').order('course_code');
  return (data as Class[]) ?? [];
}

export async function getClassesByIds(ids: string[]): Promise<Class[]> {
  if (ids.length === 0) return [];
  if (!isSupabaseConfigured()) {
    return mockData.getClassesByIds(ids);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('classes').select('*').in('id', ids);
  return (data as Class[]) ?? [];
}

export async function getUserClassIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const overrides = getStoredUserClasses();
    if (userId in overrides) return overrides[userId];
    return mockData.getStudentClassIds(userId);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('user_classes').select('class_id').eq('user_id', userId);
  return (data ?? []).map((row) => row.class_id);
}

/** Batch class-id lookup for many users at once (avoids an N-query fan-out
 * when scoring a full match list). */
export async function getUserClassIdsForUsers(userIds: string[]): Promise<Record<string, string[]>> {
  if (userIds.length === 0) return {};
  if (!isSupabaseConfigured()) {
    const overrides = getStoredUserClasses();
    const result: Record<string, string[]> = {};
    for (const id of userIds) {
      result[id] = id in overrides ? overrides[id] : mockData.getStudentClassIds(id);
    }
    return result;
  }
  const client = createClient();
  if (!client) return {};
  const { data } = await client.from('user_classes').select('user_id,class_id').in('user_id', userIds);
  const result: Record<string, string[]> = {};
  for (const row of data ?? []) {
    (result[row.user_id] ??= []).push(row.class_id);
  }
  return result;
}

/** Replaces a user's class enrollments with exactly `classIds` — used by
 * onboarding, which previously collected this and never saved it anywhere. */
export async function saveUserClasses(userId: string, classIds: string[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    setStoredUserClasses(userId, classIds);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('user_classes').delete().eq('user_id', userId);
  if (classIds.length > 0) {
    await client.from('user_classes').insert(classIds.map((class_id) => ({ user_id: userId, class_id })));
  }
}

// ============================================================
// Clubs
// ============================================================

export async function getAllClubs(): Promise<Club[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getClubs();
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('clubs').select('*').eq('is_active', true);
  return (data as Club[]) ?? [];
}

export async function getClubById(id: string): Promise<Club | null> {
  if (!isSupabaseConfigured()) {
    return mockData.getClubById(id) ?? null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client.from('clubs').select('*').eq('id', id).maybeSingle();
  return data as Club | null;
}

// ============================================================
// Events
// ============================================================

export async function getAllEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getEvents();
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('events').select('*').order('start_time');
  return (data as Event[]) ?? [];
}

export async function getEventById(id: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) {
    return mockData.getEventById(id) ?? null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client.from('events').select('*').eq('id', id).maybeSingle();
  return data as Event | null;
}

// ============================================================
// Pods
// ============================================================

export async function getAllPods(): Promise<Pod[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getPods();
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('pods').select('*').eq('is_active', true);
  return (data as Pod[]) ?? [];
}

export async function getPodById(id: string): Promise<Pod | null> {
  if (!isSupabaseConfigured()) {
    return mockData.getPodById(id) ?? null;
  }
  const client = createClient();
  if (!client) return null;
  const { data } = await client.from('pods').select('*').eq('id', id).maybeSingle();
  return data as Pod | null;
}

export async function getPodMembers(podId: string): Promise<PodMember[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getPodMembers(podId);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('pod_members').select('*').eq('pod_id', podId);
  return (data as PodMember[]) ?? [];
}

export async function getUserPods(userId: string): Promise<Pod[]> {
  if (!isSupabaseConfigured()) {
    return mockData.getUserPods(userId);
  }
  const client = createClient();
  if (!client) return [];
  const { data: memberships } = await client.from('pod_members').select('pod_id').eq('user_id', userId);
  const podIds = (memberships ?? []).map((m) => m.pod_id);
  if (podIds.length === 0) return [];
  const { data } = await client.from('pods').select('*').in('id', podIds);
  return (data as Pod[]) ?? [];
}
