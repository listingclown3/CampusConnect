'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Profile } from '@/types/database';
import {
  mockLogin,
  mockDemoLogin,
  mockLogout,
  getStoredUser,
  updateStoredUser,
} from './mock-auth';

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
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = mockLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const demoLogin = useCallback(() => {
    const result = mockDemoLogin();
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((profile: Profile) => {
    updateStoredUser(profile);
    setUser(profile);
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
