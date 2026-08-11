'use client';

import { notifyStorageChange } from '@/lib/storage-sync';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  notifyStorageChange();
}

// ============================================================
// Real-mode helpers
// ============================================================
// The `matches` table models precomputed match recommendations
// (user_id, matched_user_id, score, breakdown...) and `match_actions`
// records what a user did with a given match (like/pass/super_like) — see
// supabase/migrations/001_initial_schema.sql. Saving/skipping a profile
// encountered while browsing (not necessarily a precomputed match) has to
// resolve to a `matches` row first.
//
// RLS notes (supabase/migrations/002_rls_policies.sql):
//   - matches: SELECT where user_id/matched_user_id = auth.uid(); INSERT is
//     service_role only. So if no matches row exists yet for a pair, this
//     client can't create one — ensureMatchId() falls through to null and
//     the calling action becomes a no-op. Widening the INSERT policy (or
//     adding a service-role endpoint) is needed for save/skip to work for
//     arbitrary browsed profiles rather than only pre-seeded matches.
//   - match_actions: SELECT/INSERT where user_id = auth.uid(); there is no
//     UPDATE or DELETE policy, so unsaveMatch/undoSkipMatch can't actually
//     remove or flip a previously-recorded action server-side — the delete
//     below is best-effort and will silently affect 0 rows until that
//     policy gap is closed.

async function getMyId(client: SupabaseClient): Promise<string | null> {
  const { data } = await client.auth.getUser();
  return data.user?.id ?? null;
}

async function findExistingMatchId(client: SupabaseClient, myId: string, otherId: string): Promise<string | null> {
  const { data } = await client
    .from('matches')
    .select('id')
    .or(`and(user_id.eq.${myId},matched_user_id.eq.${otherId}),and(user_id.eq.${otherId},matched_user_id.eq.${myId})`)
    .maybeSingle();
  return data?.id ?? null;
}

/** Finds a matches row for the pair, or attempts to create one (only
 * succeeds if RLS permits — see note above). */
async function ensureMatchId(client: SupabaseClient, myId: string, otherId: string): Promise<string | null> {
  const existing = await findExistingMatchId(client, myId, otherId);
  if (existing) return existing;
  const { data, error } = await client
    .from('matches')
    .insert({
      user_id: myId,
      matched_user_id: otherId,
      score: 0,
      breakdown: {},
      reasons: [],
      status: 'pending',
      connection_type: 'friends',
    })
    .select('id')
    .single();
  if (error || !data) return null;
  return data.id;
}

async function getMatchActionsForUser(
  client: SupabaseClient,
  myId: string,
  action: 'like' | 'pass'
): Promise<string[]> {
  const { data: matches } = await client
    .from('matches')
    .select('id,user_id,matched_user_id')
    .or(`user_id.eq.${myId},matched_user_id.eq.${myId}`);
  const otherIdByMatch = new Map<string, string>(
    (matches ?? []).map((m) => [m.id, m.user_id === myId ? m.matched_user_id : m.user_id])
  );
  if (otherIdByMatch.size === 0) return [];

  const { data: actions } = await client
    .from('match_actions')
    .select('match_id')
    .eq('user_id', myId)
    .eq('action', action)
    .in('match_id', [...otherIdByMatch.keys()]);

  return (actions ?? [])
    .map((a) => otherIdByMatch.get(a.match_id))
    .filter((id): id is string => !!id);
}

async function recordMatchAction(otherId: string, action: 'like' | 'pass'): Promise<void> {
  const client = createClient();
  if (!client) return;
  const myId = await getMyId(client);
  if (!myId) return;
  const matchId = await ensureMatchId(client, myId, otherId);
  if (!matchId) return;
  const { error } = await client.from('match_actions').insert({ match_id: matchId, user_id: myId, action });
  if (error) {
    // Unique constraint (match_id, user_id) — a prior action already exists.
    // There's no UPDATE policy on match_actions, so this is best-effort only.
    await client.from('match_actions').update({ action }).eq('match_id', matchId).eq('user_id', myId);
  }
}

async function clearMatchAction(otherId: string): Promise<void> {
  const client = createClient();
  if (!client) return;
  const myId = await getMyId(client);
  if (!myId) return;
  const matchId = await findExistingMatchId(client, myId, otherId);
  if (!matchId) return;
  // Best-effort: match_actions has no DELETE policy yet, so this currently
  // affects 0 rows in real mode (see note above).
  await client.from('match_actions').delete().eq('match_id', matchId).eq('user_id', myId);
}

async function hasMatchAction(otherId: string, action: 'like' | 'pass'): Promise<boolean> {
  const client = createClient();
  if (!client) return false;
  const myId = await getMyId(client);
  if (!myId) return false;
  const matchId = await findExistingMatchId(client, myId, otherId);
  if (!matchId) return false;
  const { data } = await client
    .from('match_actions')
    .select('id')
    .eq('match_id', matchId)
    .eq('user_id', myId)
    .eq('action', action)
    .maybeSingle();
  return !!data;
}

// ============================================================
// Public API
// ============================================================

export async function getSavedMatches(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return getStorageArray(SAVED_KEY);
  }
  const client = createClient();
  if (!client) return [];
  const myId = await getMyId(client);
  if (!myId) return [];
  return getMatchActionsForUser(client, myId, 'like');
}

export async function getSkippedMatches(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return getStorageArray(SKIPPED_KEY);
  }
  const client = createClient();
  if (!client) return [];
  const myId = await getMyId(client);
  if (!myId) return [];
  return getMatchActionsForUser(client, myId, 'pass');
}

export async function saveMatch(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const saved = getStorageArray(SAVED_KEY);
    if (!saved.includes(userId)) {
      saved.push(userId);
      setStorageArray(SAVED_KEY, saved);
    }
    return;
  }
  await recordMatchAction(userId, 'like');
}

export async function unsaveMatch(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const saved = getStorageArray(SAVED_KEY).filter((id) => id !== userId);
    setStorageArray(SAVED_KEY, saved);
    return;
  }
  await clearMatchAction(userId);
}

export async function skipMatch(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const skipped = getStorageArray(SKIPPED_KEY);
    if (!skipped.includes(userId)) {
      skipped.push(userId);
      setStorageArray(SKIPPED_KEY, skipped);
    }
    return;
  }
  await recordMatchAction(userId, 'pass');
}

export async function undoSkipMatch(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const skipped = getStorageArray(SKIPPED_KEY).filter((id) => id !== userId);
    setStorageArray(SKIPPED_KEY, skipped);
    return;
  }
  await clearMatchAction(userId);
}

export async function isMatchSaved(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return getStorageArray(SAVED_KEY).includes(userId);
  }
  return hasMatchAction(userId, 'like');
}

export async function isMatchSkipped(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return getStorageArray(SKIPPED_KEY).includes(userId);
  }
  return hasMatchAction(userId, 'pass');
}
