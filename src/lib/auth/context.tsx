'use client';

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import type { Profile } from '@/types/database';
import {
  mockLogin,
  mockDemoLogin,
  mockLogout,
  getStoredUser,
  updateStoredUser,
} from './mock-auth';
import { subscribeToStorage } from '@/lib/storage-sync';

// Sentinel distinguishing "haven't checked storage yet" (server/first paint)
// from "checked, no user found" (null).
const UNDETERMINED = Symbol('undetermined');

function getServerSnapshot(): Profile | null | typeof UNDETERMINED {
  return UNDETERMINED;
}

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeToStorage, getStoredUser, getServerSnapshot);
  const isLoading = snapshot === UNDETERMINED;
  const user = isLoading ? null : snapshot;

  // password is kept in the public signature so the login form's password
  // field has somewhere to go; the mock backend doesn't validate it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback((email: string, password: string) => {
    const result = mockLogin(email);
    if (result.success && result.user) {
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const demoLogin = useCallback(() => {
    mockDemoLogin();
  }, []);

  const logout = useCallback(() => {
    mockLogout();
  }, []);

  const updateProfile = useCallback((profile: Profile) => {
    updateStoredUser(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
