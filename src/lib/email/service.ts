'use client';

import { notifyStorageChange } from '@/lib/storage-sync';

// ============================================================
// Email Service Types
// ============================================================

export interface EmailVerification {
  email: string;
  code: string;
  verified: boolean;
  sentAt: string;
  expiresAt: string;
}

export interface EmailPreferences {
  enabled: boolean;
  chatMessages: boolean;
  eventUpdates: boolean;
  eventReminders: boolean;
  podActivity: boolean;
  newMatches: boolean;
  weeklyDigest: boolean;
}

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  VERIFICATION: 'spartancircle_email_verification',
  PREFERENCES: 'spartancircle_email_preferences',
  EMAIL_LOG: 'spartancircle_email_log',
} as const;

// ============================================================
// Default Preferences
// ============================================================

const DEFAULT_PREFERENCES: EmailPreferences = {
  enabled: true,
  chatMessages: true,
  eventUpdates: true,
  eventReminders: true,
  podActivity: true,
  newMatches: true,
  weeklyDigest: true,
};

// ============================================================
// Verification Flow
// ============================================================

/**
 * Generate a 6-digit verification code and "send" it.
 * In production, this would call an email API (SendGrid, Resend, etc.).
 * For now it stores the code in localStorage to simulate the flow.
 */
export function sendVerificationEmail(email: string): { success: boolean; code: string } {
  const code = generateVerificationCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  const verification: EmailVerification = {
    email,
    code,
    verified: false,
    sentAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(verification));
    notifyStorageChange();
  }

  // In production: await sendgrid.send({ to: email, subject: '...', html: '...' })
  // For demo, we'll show the code in a toast
  logEmail({
    to: email,
    subject: 'Verify Your Email - SpartanCircle',
    body: `Your verification code is: ${code}. It expires in 10 minutes.`,
    type: 'verification',
  });

  return { success: true, code };
}

/**
 * Verify the code entered by the user.
 */
export function verifyEmailCode(inputCode: string): { success: boolean; error?: string } {
  const verification = getVerificationState();
  if (!verification) {
    return { success: false, error: 'No verification in progress. Please request a new code.' };
  }

  if (new Date() > new Date(verification.expiresAt)) {
    return { success: false, error: 'Code has expired. Please request a new one.' };
  }

  if (verification.code !== inputCode) {
    return { success: false, error: 'Invalid code. Please check and try again.' };
  }

  // Mark as verified
  verification.verified = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(verification));
    notifyStorageChange();
  }

  return { success: true };
}

/**
 * Check current verification state.
 */
export function getVerificationState(): EmailVerification | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user's email is verified.
 */
export function isEmailVerified(): boolean {
  const state = getVerificationState();
  return state?.verified === true;
}

/**
 * Resend verification code.
 */
export function resendVerificationEmail(): { success: boolean; code: string } | { success: false; error: string } {
  const state = getVerificationState();
  if (!state) {
    return { success: false, error: 'No email to verify' };
  }

  // Rate limit: don't resend within 60 seconds
  const timeSinceSent = Date.now() - new Date(state.sentAt).getTime();
  if (timeSinceSent < 60000) {
    const waitSeconds = Math.ceil((60000 - timeSinceSent) / 1000);
    return { success: false, error: `Please wait ${waitSeconds}s before requesting a new code` };
  }

  return sendVerificationEmail(state.email);
}

// ============================================================
// Email Preferences
// ============================================================

export function getEmailPreferences(): EmailPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    // fall through
  }
  return DEFAULT_PREFERENCES;
}

export function updateEmailPreferences(prefs: Partial<EmailPreferences>): EmailPreferences {
  const current = getEmailPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    notifyStorageChange();
  }
  return updated;
}

// ============================================================
// Email Sending (Simulated)
// ============================================================

interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'verification' | 'notification' | 'digest' | 'reminder';
  sentAt: string;
}

function logEmail(email: Omit<EmailLogEntry, 'id' | 'sentAt'>): void {
  if (typeof window === 'undefined') return;
  const log = getEmailLog();
  log.unshift({
    ...email,
    id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sentAt: new Date().toISOString(),
  });
  // Keep max 20 entries
  if (log.length > 20) log.pop();
  localStorage.setItem(STORAGE_KEYS.EMAIL_LOG, JSON.stringify(log));
}

export function getEmailLog(): EmailLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAIL_LOG);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Send a notification email (simulated).
 * In production, this would integrate with SendGrid/Resend/SES.
 */
export function sendNotificationEmail(to: string, subject: string, body: string): void {
  const prefs = getEmailPreferences();
  if (!prefs.enabled) return;
  if (!isEmailVerified()) return;

  logEmail({ to, subject, body, type: 'notification' });
}

/**
 * Send event reminder email (simulated).
 */
export function sendEventReminderEmail(to: string, eventTitle: string, eventTime: string, location: string): void {
  const prefs = getEmailPreferences();
  if (!prefs.enabled || !prefs.eventReminders) return;
  if (!isEmailVerified()) return;

  logEmail({
    to,
    subject: `Reminder: ${eventTitle} is coming up!`,
    body: `Don't forget! "${eventTitle}" starts at ${eventTime} at ${location}. See you there!`,
    type: 'reminder',
  });
}

// ============================================================
// Helpers
// ============================================================

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
