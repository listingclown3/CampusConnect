'use client';

import type { SocialLink } from '@/types/social-links';
import { notifyStorageChange } from '@/lib/storage-sync';

const STORAGE_KEY = 'spartancircle_social_links';

/**
 * Get all social links for a user.
 */
export function getSocialLinks(userId: string): SocialLink[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const allLinks: Record<string, SocialLink[]> = JSON.parse(stored);
    return allLinks[userId] || [];
  } catch {
    return [];
  }
}

/**
 * Get only public social links for a user (for display on profiles).
 */
export function getPublicSocialLinks(userId: string): SocialLink[] {
  return getSocialLinks(userId).filter(link => link.isPublic);
}

/**
 * Save a new social link for a user.
 */
export function addSocialLink(userId: string, link: Omit<SocialLink, 'id' | 'createdAt'>): SocialLink {
  const newLink: SocialLink = {
    ...link,
    id: `sl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const allLinks = getAllLinks();
  if (!allLinks[userId]) allLinks[userId] = [];
  allLinks[userId].push(newLink);
  saveAllLinks(allLinks);
  return newLink;
}

/**
 * Update an existing social link.
 */
export function updateSocialLink(userId: string, linkId: string, updates: Partial<Pick<SocialLink, 'value' | 'label' | 'isPublic'>>): SocialLink | null {
  const allLinks = getAllLinks();
  const userLinks = allLinks[userId] || [];
  const idx = userLinks.findIndex(l => l.id === linkId);
  if (idx === -1) return null;

  userLinks[idx] = { ...userLinks[idx], ...updates };
  allLinks[userId] = userLinks;
  saveAllLinks(allLinks);
  return userLinks[idx];
}

/**
 * Remove a social link.
 */
export function removeSocialLink(userId: string, linkId: string): boolean {
  const allLinks = getAllLinks();
  const userLinks = allLinks[userId] || [];
  const filtered = userLinks.filter(l => l.id !== linkId);
  if (filtered.length === userLinks.length) return false;

  allLinks[userId] = filtered;
  saveAllLinks(allLinks);
  return true;
}

/**
 * Toggle the public visibility of a link.
 */
export function toggleLinkVisibility(userId: string, linkId: string): SocialLink | null {
  const allLinks = getAllLinks();
  const userLinks = allLinks[userId] || [];
  const idx = userLinks.findIndex(l => l.id === linkId);
  if (idx === -1) return null;

  userLinks[idx].isPublic = !userLinks[idx].isPublic;
  allLinks[userId] = userLinks;
  saveAllLinks(allLinks);
  return userLinks[idx];
}

// Internal helpers
function getAllLinks(): Record<string, SocialLink[]> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  return {};
}

function saveAllLinks(links: Record<string, SocialLink[]>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  notifyStorageChange();
}
