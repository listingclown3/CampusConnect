'use client';

const SAVED_KEY = 'spartancircle_saved_matches';
const SKIPPED_KEY = 'spartancircle_skipped_matches';

function getStorageArray(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStorageArray(key: string, value: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedMatches(): string[] {
  return getStorageArray(SAVED_KEY);
}

export function getSkippedMatches(): string[] {
  return getStorageArray(SKIPPED_KEY);
}

export function saveMatch(userId: string): void {
  const saved = getSavedMatches();
  if (!saved.includes(userId)) {
    saved.push(userId);
    setStorageArray(SAVED_KEY, saved);
  }
}

export function unsaveMatch(userId: string): void {
  const saved = getSavedMatches().filter((id) => id !== userId);
  setStorageArray(SAVED_KEY, saved);
}

export function skipMatch(userId: string): void {
  const skipped = getSkippedMatches();
  if (!skipped.includes(userId)) {
    skipped.push(userId);
    setStorageArray(SKIPPED_KEY, skipped);
  }
}

export function undoSkipMatch(userId: string): void {
  const skipped = getSkippedMatches().filter((id) => id !== userId);
  setStorageArray(SKIPPED_KEY, skipped);
}

export function isMatchSaved(userId: string): boolean {
  return getSavedMatches().includes(userId);
}

export function isMatchSkipped(userId: string): boolean {
  return getSkippedMatches().includes(userId);
}
