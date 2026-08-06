'use client';

/**
 * Shared pub-sub for the localStorage-backed mock data layer. Every mock
 * store (auth, chat, matches, events) calls notifyStorageChange() after a
 * write, and components read via useSyncExternalStore(subscribeToStorage, ...)
 * instead of duplicating reads into local state inside an effect.
 */

const listeners = new Set<() => void>();
let version = 0;

export function notifyStorageChange(): void {
  version++;
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeToStorage(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Wraps a derived read (e.g. one that filters/sorts/parses into a new
 * object or array each call) so repeated calls between storage changes
 * return the same cached reference. Required for useSyncExternalStore,
 * which otherwise treats a fresh reference as a change on every render.
 */
export function createStorageSnapshot<T>(compute: () => T): () => T {
  let cachedVersion = -1;
  let cachedValue: T;
  return () => {
    if (cachedVersion !== version) {
      cachedValue = compute();
      cachedVersion = version;
    }
    return cachedValue;
  };
}
