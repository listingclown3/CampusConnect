import { mockStudents } from '@/lib/mock-data/students';
import type { Profile } from '@/types/database';

const STORAGE_KEY = 'spartancircle_auth_user';

/**
 * Validate that an email is an @sjsu.edu address.
 */
export function validateSjsuEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@sjsu.edu');
}

/**
 * Mock login: accepts any @sjsu.edu email.
 * Returns the matching student profile or the first student as demo user.
 */
export function mockLogin(email: string, _password: string): { success: boolean; user: Profile | null; error?: string } {
  if (!validateSjsuEmail(email)) {
    return { success: false, user: null, error: 'Please use an @sjsu.edu email address' };
  }

  // Find student by email prefix matching first_name or use first student
  const emailPrefix = email.split('@')[0].toLowerCase();
  const matchedStudent = mockStudents.find(
    (s) => s.first_name.toLowerCase() === emailPrefix || s.display_name.toLowerCase().startsWith(emailPrefix)
  );

  const user = matchedStudent || mockStudents[0];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return { success: true, user };
}

/**
 * Demo login with preset credentials.
 */
export function mockDemoLogin(): { success: boolean; user: Profile } {
  const user = mockStudents[0];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return { success: true, user };
}

/**
 * Get the currently stored user from localStorage.
 */
export function getStoredUser(): Profile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Profile;
    }
  } catch {
    // Invalid stored data
    localStorage.removeItem(STORAGE_KEY);
  }

  return null;
}

/**
 * Clear stored user (logout).
 */
export function mockLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if a user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return getStoredUser() !== null;
}

/**
 * Update the stored user profile.
 */
export function updateStoredUser(profile: Profile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}
