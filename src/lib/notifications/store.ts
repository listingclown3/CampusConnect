'use client';

import { notifyStorageChange } from '@/lib/storage-sync';

// ============================================================
// Notification Types
// ============================================================

export type NotificationType = 'chat' | 'event_update' | 'pod_invite' | 'match' | 'system' | 'event_reminder';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================
// Storage
// ============================================================

const STORAGE_KEY = 'spartancircle_notifications';

export function getNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  notifyStorageChange();
}

// ============================================================
// Actions
// ============================================================

export function addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification {
  const newNotif: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const notifications = getNotifications();
  // Keep most recent first, max 50
  notifications.unshift(newNotif);
  if (notifications.length > 50) notifications.pop();
  saveNotifications(notifications);

  // Dispatch custom event for real-time UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notification-added', { detail: newNotif }));
  }

  return newNotif;
}

export function markAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const idx = notifications.findIndex((n) => n.id === notificationId);
  if (idx === -1) return;
  notifications[idx].read = true;
  saveNotifications(notifications);
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach((n) => { n.read = true; });
  saveNotifications(notifications);
}

export function deleteNotification(notificationId: string): void {
  const notifications = getNotifications();
  const filtered = notifications.filter((n) => n.id !== notificationId);
  saveNotifications(filtered);
}

export function clearAllNotifications(): void {
  saveNotifications([]);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// ============================================================
// Helper: Create specific notification types
// ============================================================

export function notifyNewMessage(senderName: string, conversationId: string, preview: string): AppNotification {
  return addNotification({
    type: 'chat',
    title: `New message from ${senderName}`,
    message: preview.length > 80 ? preview.slice(0, 80) + '...' : preview,
    actionUrl: `/chat?id=${conversationId}`,
    metadata: { conversationId, senderName },
  });
}

export function notifyEventUpdate(eventTitle: string, eventId: string, updateType: string): AppNotification {
  return addNotification({
    type: 'event_update',
    title: `Event Update: ${eventTitle}`,
    message: updateType,
    actionUrl: `/events/${eventId}`,
    metadata: { eventId },
  });
}

export function notifyEventReminder(eventTitle: string, eventId: string, timeUntil: string): AppNotification {
  return addNotification({
    type: 'event_reminder',
    title: `Reminder: ${eventTitle}`,
    message: `Starting ${timeUntil}. Don't forget to attend!`,
    actionUrl: `/events/${eventId}`,
    metadata: { eventId },
  });
}

export function notifyPodActivity(podName: string, podId: string, activity: string): AppNotification {
  return addNotification({
    type: 'pod_invite',
    title: podName,
    message: activity,
    actionUrl: `/pods/${podId}`,
    metadata: { podId },
  });
}

export function notifyNewMatch(matchName: string, matchUserId: string): AppNotification {
  return addNotification({
    type: 'match',
    title: 'New Match!',
    message: `You matched with ${matchName}. Check out their profile!`,
    actionUrl: '/matches',
    metadata: { matchUserId },
  });
}
