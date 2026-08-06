'use client';

import type { Block, Report, ReportReason } from '@/types/database';

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

export function getBlockedUsers(userId: string): Block[] {
  const blocks = getStorageItems<Block>(BLOCKS_KEY);
  return blocks.filter((b) => b.blocker_id === userId);
}

export function getAllBlocks(): Block[] {
  return getStorageItems<Block>(BLOCKS_KEY);
}

export function isUserBlocked(blockerId: string, blockedUserId: string): boolean {
  const blocks = getStorageItems<Block>(BLOCKS_KEY);
  return blocks.some(
    (b) => b.blocker_id === blockerId && b.blocked_user_id === blockedUserId
  );
}

export function blockUser(blockerId: string, blockedUserId: string): void {
  const blocks = getStorageItems<Block>(BLOCKS_KEY);
  if (blocks.some((b) => b.blocker_id === blockerId && b.blocked_user_id === blockedUserId)) {
    return; // Already blocked
  }
  const newBlock: Block = {
    id: `block_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    blocker_id: blockerId,
    blocked_user_id: blockedUserId,
    created_at: new Date().toISOString(),
  };
  blocks.push(newBlock);
  setStorageItems(BLOCKS_KEY, blocks);
}

export function unblockUser(blockerId: string, blockedUserId: string): void {
  const blocks = getStorageItems<Block>(BLOCKS_KEY);
  const filtered = blocks.filter(
    (b) => !(b.blocker_id === blockerId && b.blocked_user_id === blockedUserId)
  );
  setStorageItems(BLOCKS_KEY, filtered);
}

// ============================================================
// Report functions
// ============================================================

export function getReports(): Report[] {
  return getStorageItems<Report>(REPORTS_KEY);
}

export function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason: ReportReason,
  description?: string
): void {
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
}

export function reportMessage(
  reporterId: string,
  reportedUserId: string,
  reason: ReportReason,
  messageId: string,
  description?: string
): void {
  const reports = getStorageItems<Report>(REPORTS_KEY);
  const newReport: Report = {
    id: `report_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    reporter_id: reporterId,
    reported_user_id: reportedUserId,
    reason,
    description: description ? `[Message: ${messageId}] ${description}` : `[Message: ${messageId}]`,
    status: 'pending',
    created_at: new Date().toISOString(),
    resolved_at: null,
  };
  reports.push(newReport);
  setStorageItems(REPORTS_KEY, reports);
}

// ============================================================
// Filtering helpers
// ============================================================

/**
 * Get an array of user IDs that should be hidden from the given user.
 * This includes users they've blocked and users who've blocked them.
 */
export function getHiddenUserIds(currentUserId: string): string[] {
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
