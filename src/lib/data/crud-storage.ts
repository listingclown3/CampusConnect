'use client';

import type { Pod, Event, Club } from '@/types/database';
import { notifyStorageChange } from '@/lib/storage-sync';

// ============================================================
// Storage keys for user-created items
// ============================================================

const KEYS = {
  USER_PODS: 'spartancircle_user_pods',
  USER_EVENTS: 'spartancircle_user_events',
  USER_CLUBS: 'spartancircle_user_clubs',
} as const;

// ============================================================
// Pods CRUD
// ============================================================

export function getUserCreatedPods(): Pod[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_PODS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function createPod(pod: Omit<Pod, 'id' | 'created_at' | 'updated_at'>): Pod {
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

export function updatePod(podId: string, updates: Partial<Omit<Pod, 'id' | 'created_at'>>): Pod | null {
  const pods = getUserCreatedPods();
  const idx = pods.findIndex((p) => p.id === podId);
  if (idx === -1) return null;

  pods[idx] = { ...pods[idx], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(KEYS.USER_PODS, JSON.stringify(pods));
  notifyStorageChange();
  return pods[idx];
}

export function deletePod(podId: string): boolean {
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
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_EVENTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function createEvent(event: Omit<Event, 'id' | 'created_at'>): Event {
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

export function updateEvent(eventId: string, updates: Partial<Omit<Event, 'id' | 'created_at'>>): Event | null {
  const events = getUserCreatedEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;

  events[idx] = { ...events[idx], ...updates };
  localStorage.setItem(KEYS.USER_EVENTS, JSON.stringify(events));
  notifyStorageChange();
  return events[idx];
}

export function deleteEvent(eventId: string): boolean {
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
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.USER_CLUBS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function createClub(club: Omit<Club, 'id' | 'created_at'>): Club {
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

export function updateClub(clubId: string, updates: Partial<Omit<Club, 'id' | 'created_at'>>): Club | null {
  const clubs = getUserCreatedClubs();
  const idx = clubs.findIndex((c) => c.id === clubId);
  if (idx === -1) return null;

  clubs[idx] = { ...clubs[idx], ...updates };
  localStorage.setItem(KEYS.USER_CLUBS, JSON.stringify(clubs));
  notifyStorageChange();
  return clubs[idx];
}

export function deleteClub(clubId: string): boolean {
  const clubs = getUserCreatedClubs();
  const filtered = clubs.filter((c) => c.id !== clubId);
  if (filtered.length === clubs.length) return false;
  localStorage.setItem(KEYS.USER_CLUBS, JSON.stringify(filtered));
  notifyStorageChange();
  return true;
}
