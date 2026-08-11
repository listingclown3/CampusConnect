'use client';

import type { Block, Report, ReportReason } from '@/types/database';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { getBlocks, addBlock } from '@/lib/chat/realtime';

const BLOCKS_KEY = 'spartancircle_blocks';
const REPORTS_KEY = 'spartancircle_reports';

function getStorageItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStorageItems<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
}

// ============================================================
// Block functions
// ============================================================
// getBlockedUsers/blockUser reuse chat/realtime.ts's getBlocks/addBlock
// rather than reimplementing the same mock/real split against the same
// `blocks` table.

export async function getBlockedUsers(userId: string): Promise<Block[]> {
  const blocks = await getBlocks(userId);
  // getBlocks(userId) returns rows where the user is blocker OR blocked (mock
  // mode) but only blocker_id = userId in real mode (RLS restriction — see
  // chat/realtime.ts). Filter to "blocks I placed" either way, matching this
  // function's historical contract.
  return blocks
    .filter((b) => b.blocker_id === userId)
    .map((b, i) => ({ id: `block-${b.blocker_id}-${b.blocked_user_id}-${i}`, ...b })) as Block[];
}

export async function getAllBlocks(): Promise<Block[]> {
  if (!isSupabaseConfigured()) {
    return getStorageItems<Block>(BLOCKS_KEY);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('blocks').select('*');
  return (data as Block[]) ?? [];
}

export async function isUserBlocked(blockerId: string, blockedUserId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const blocks = getStorageItems<Block>(BLOCKS_KEY);
    return blocks.some(
      (b) => b.blocker_id === blockerId && b.blocked_user_id === blockedUserId
    );
  }
  const client = createClient();
  if (!client) return false;
  const { data } = await client
    .from('blocks')
    .select('id')
    .eq('blocker_id', blockerId)
    .eq('blocked_user_id', blockedUserId)
    .maybeSingle();
  return !!data;
}

export async function blockUser(blockerId: string, blockedUserId: string): Promise<void> {
  if (await isUserBlocked(blockerId, blockedUserId)) return; // Already blocked
  await addBlock(blockerId, blockedUserId);
}

export async function unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const blocks = getStorageItems<Block>(BLOCKS_KEY);
    const filtered = blocks.filter(
      (b) => !(b.blocker_id === blockerId && b.blocked_user_id === blockedUserId)
    );
    setStorageItems(BLOCKS_KEY, filtered);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('blocks').delete().eq('blocker_id', blockerId).eq('blocked_user_id', blockedUserId);
}

// ============================================================
// Report functions
// ============================================================

export async function getReports(): Promise<Report[]> {
  if (!isSupabaseConfigured()) {
    return getStorageItems<Report>(REPORTS_KEY);
  }
  const client = createClient();
  if (!client) return [];
  const { data } = await client.from('reports').select('*');
  return (data as Report[]) ?? [];
}

export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason: ReportReason,
  description?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const reports = getStorageItems<Report>(REPORTS_KEY);
    const newReport: Report = {
      id: `report_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      description: description || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      resolved_at: null,
    };
    reports.push(newReport);
    setStorageItems(REPORTS_KEY, reports);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('reports').insert({
    reporter_id: reporterId,
    reported_user_id: reportedUserId,
    reason,
    description: description || null,
  });
}

export async function reportMessage(
  reporterId: string,
  reportedUserId: string,
  reason: ReportReason,
  messageId: string,
  description?: string
): Promise<void> {
  const fullDescription = description ? `[Message: ${messageId}] ${description}` : `[Message: ${messageId}]`;
  if (!isSupabaseConfigured()) {
    const reports = getStorageItems<Report>(REPORTS_KEY);
    const newReport: Report = {
      id: `report_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      description: fullDescription,
      status: 'pending',
      created_at: new Date().toISOString(),
      resolved_at: null,
    };
    reports.push(newReport);
    setStorageItems(REPORTS_KEY, reports);
    return;
  }
  const client = createClient();
  if (!client) return;
  await client.from('reports').insert({
    reporter_id: reporterId,
    reported_user_id: reportedUserId,
    reason,
    description: fullDescription,
  });
}

// ============================================================
// Filtering helpers
// ============================================================

/**
 * Get an array of user IDs that should be hidden from the given user.
 * This includes users they've blocked and users who've blocked them.
 *
 * In real mode, RLS on `blocks` only exposes rows the caller placed
 * (blocker_id = auth.uid()) — see chat/realtime.ts's getBlocks. So the
 * "users who've blocked me" half of this can't be computed client-side
 * here; that direction is left to be enforced server-side.
 */
export async function getHiddenUserIds(currentUserId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const blocks = getStorageItems<Block>(BLOCKS_KEY);
    const hidden = new Set<string>();

    blocks.forEach((b) => {
      if (b.blocker_id === currentUserId) {
        hidden.add(b.blocked_user_id);
      }
      if (b.blocked_user_id === currentUserId) {
        hidden.add(b.blocker_id);
      }
    });

    return Array.from(hidden);
  }
  const blocks = await getBlocks(currentUserId);
  return blocks.filter((b) => b.blocker_id === currentUserId).map((b) => b.blocked_user_id);
}
