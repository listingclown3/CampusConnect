'use client';

import type { Pod, Event, Club } from '@/types/database';
import { notifyStorageChange } from '@/lib/storage-sync';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// ============================================================
// Storage keys for user-created items (mock mode only)
// ============================================================

const KEYS = {
  USER_PODS: 'spartancircle_user_pods',
  USER_EVENTS: 'spartancircle_user_events',
  USER_CLUBS: 'spartancircle_user_clubs',
} as const;

// ============================================================
// Pods CRUD
// ============================================================

// Real mode: getAllPods()/getPodById() in data/client.ts already query the
// live `pods` table, which createPod() below inserts straight into — so
// there's nothing separate to merge in and this returns [] to avoid
// double-listing. Mock mode still needs a second store since mock "all
// pods" is a static seed array, not a live table.
export function getUserCreatedPods(): Pod[] {
  if (isSupabaseConfigured()) return [];
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_PODS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function createPod(pod: Omit<Pod, 'id' | 'created_at' | 'updated_at'>): Promise<Pod> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) throw new Error('Supabase is not configured.');
    const { data, error } = await client.from('pods').insert(pod).select('*').single();
    if (error || !data) throw error ?? new Error('Failed to create pod.');
    return data as Pod;
  }

  const newPod: Pod = {
    ...pod,
    id: `pod-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const pods = getUserCreatedPods();
  pods.push(newPod);
  localStorage.setItem(KEYS.USER_PODS, JSON.stringify(pods));
  notifyStorageChange();
  return newPod;
}

export async function updatePod(podId: string, updates: Partial<Omit<Pod, 'id' | 'created_at'>>): Promise<Pod | null> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return null;
    const { data } = await client
      .from('pods')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', podId)
      .select('*')
      .maybeSingle();
    return data as Pod | null;
  }

  const pods = getUserCreatedPods();
  const idx = pods.findIndex((p) => p.id === podId);
  if (idx === -1) return null;

  pods[idx] = { ...pods[idx], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(KEYS.USER_PODS, JSON.stringify(pods));
  notifyStorageChange();
  return pods[idx];
}

export async function deletePod(podId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return false;
    const { error } = await client.from('pods').delete().eq('id', podId);
    return !error;
  }

  const pods = getUserCreatedPods();
  const filtered = pods.filter((p) => p.id !== podId);
  if (filtered.length === pods.length) return false;
  localStorage.setItem(KEYS.USER_PODS, JSON.stringify(filtered));
  notifyStorageChange();
  return true;
}

// ============================================================
// Events CRUD
// ============================================================

export function getUserCreatedEvents(): Event[] {
  if (isSupabaseConfigured()) return [];
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_EVENTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) throw new Error('Supabase is not configured.');
    const { data, error } = await client.from('events').insert(event).select('*').single();
    if (error || !data) throw error ?? new Error('Failed to create event.');
    return data as Event;
  }

  const newEvent: Event = {
    ...event,
    id: `evt-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  const events = getUserCreatedEvents();
  events.push(newEvent);
  localStorage.setItem(KEYS.USER_EVENTS, JSON.stringify(events));
  notifyStorageChange();
  return newEvent;
}

export async function updateEvent(eventId: string, updates: Partial<Omit<Event, 'id' | 'created_at'>>): Promise<Event | null> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return null;
    const { data } = await client.from('events').update(updates).eq('id', eventId).select('*').maybeSingle();
    return data as Event | null;
  }

  const events = getUserCreatedEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;

  events[idx] = { ...events[idx], ...updates };
  localStorage.setItem(KEYS.USER_EVENTS, JSON.stringify(events));
  notifyStorageChange();
  return events[idx];
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return false;
    const { error } = await client.from('events').delete().eq('id', eventId);
    return !error;
  }

  const events = getUserCreatedEvents();
  const filtered = events.filter((e) => e.id !== eventId);
  if (filtered.length === events.length) return false;
  localStorage.setItem(KEYS.USER_EVENTS, JSON.stringify(filtered));
  notifyStorageChange();
  return true;
}

// ============================================================
// Clubs CRUD
// ============================================================

export function getUserCreatedClubs(): Club[] {
  if (isSupabaseConfigured()) return [];
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_CLUBS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function createClub(club: Omit<Club, 'id' | 'created_at'>): Promise<Club> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) throw new Error('Supabase is not configured.');
    const { data, error } = await client.from('clubs').insert(club).select('*').single();
    if (error || !data) throw error ?? new Error('Failed to create club.');
    return data as Club;
  }

  const newClub: Club = {
    ...club,
    id: `club-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  const clubs = getUserCreatedClubs();
  clubs.push(newClub);
  localStorage.setItem(KEYS.USER_CLUBS, JSON.stringify(clubs));
  notifyStorageChange();
  return newClub;
}

export async function updateClub(clubId: string, updates: Partial<Omit<Club, 'id' | 'created_at'>>): Promise<Club | null> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return null;
    const { data } = await client.from('clubs').update(updates).eq('id', clubId).select('*').maybeSingle();
    return data as Club | null;
  }

  const clubs = getUserCreatedClubs();
  const idx = clubs.findIndex((c) => c.id === clubId);
  if (idx === -1) return null;

  clubs[idx] = { ...clubs[idx], ...updates };
  localStorage.setItem(KEYS.USER_CLUBS, JSON.stringify(clubs));
  notifyStorageChange();
  return clubs[idx];
}

export async function deleteClub(clubId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = createClient();
    if (!client) return false;
    const { error } = await client.from('clubs').delete().eq('id', clubId);
    return !error;
  }

  const clubs = getUserCreatedClubs();
  const filtered = clubs.filter((c) => c.id !== clubId);
  if (filtered.length === clubs.length) return false;
  localStorage.setItem(KEYS.USER_CLUBS, JSON.stringify(filtered));
  notifyStorageChange();
  return true;
}
