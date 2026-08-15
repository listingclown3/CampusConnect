'use client';

import { createContext, useContext, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { Profile } from '@/types/database';
import {
  mockLogin,
  mockDemoLogin,
  mockLogout,
  getStoredUser,
  updateStoredUser,
} from './mock-auth';
import { subscribeToStorage } from '@/lib/storage-sync';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { isAllowedEmail } from './domain';

// Sentinel distinguishing "haven't checked storage yet" (server/first paint)
// from "checked, no user found" (null).
const UNDETERMINED = Symbol('undetermined');

function getServerSnapshot(): Profile | null | typeof UNDETERMINED {
  return UNDETERMINED;
}

interface AuthContextType {
  user: Profile | null;
  /** The underlying auth user id. Set once signed in, even before a
   * `profiles` row exists (i.e. mid-onboarding). Null when signed out. */
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True when running against real Supabase Auth instead of the mock/localStorage backend. */
  isSupabaseAuth: boolean;
  /** Mock-mode only: synchronous email/password stand-in. */
  loginWithPassword: (email: string, password: string) => { success: boolean; error?: string };
  /** Real-mode only: sends an @sjsu.edu magic link. */
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (profile: Profile) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function MockAuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeToStorage, getStoredUser, getServerSnapshot);
  const isLoading = snapshot === UNDETERMINED;
  const user = isLoading ? null : snapshot;

  // password is kept in the public signature so the login form's password
  // field has somewhere to go; the mock backend doesn't validate it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loginWithPassword = useCallback((email: string, password: string) => {
    const result = mockLogin(email);
    if (result.success && result.user) {
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const sendMagicLink = useCallback(async () => {
    return { success: false, error: 'Magic-link sign-in requires Supabase to be configured.' };
  }, []);

  const demoLogin = useCallback(() => {
    mockDemoLogin();
  }, []);

  const logout = useCallback(() => {
    mockLogout();
  }, []);

  const updateProfile = useCallback(async (profile: Profile) => {
    updateStoredUser(profile);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.user_id ?? null,
        isLoading,
        isAuthenticated: user !== null,
        isSupabaseAuth: false,
        loginWithPassword,
        sendMagicLink,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  // Lazily seeded so the "Supabase isn't actually configured" branch (which
  // never sets state from inside the effect) doesn't leave this stuck true.
  const [isLoading, setIsLoading] = useState(() => !!createClient());

  const fetchProfile = useCallback(async (uid: string) => {
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();
    return data as Profile | null;
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session?.user) {
        setUserId(session.user.id);
        setUser(await fetchProfile(session.user.id));
      }
      setIsLoading(false);
    };
    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        setUserId(session.user.id);
        setUser(await fetchProfile(session.user.id));
      } else {
        setUserId(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const loginWithPassword = useCallback(() => {
    return { success: false, error: 'Password sign-in is disabled. Use your @sjsu.edu magic link.' };
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!isAllowedEmail(email)) {
      return { success: false, error: 'Please use your @sjsu.edu email address' };
    }
    const supabase = createClient();
    if (!supabase) return { success: false, error: 'Supabase is not configured.' };

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const demoLogin = useCallback(() => {
    // No mock shortcut against a real backend.
  }, []);

  const logout = useCallback(() => {
    const supabase = createClient();
    supabase?.auth.signOut();
  }, []);

  const updateProfile = useCallback(
    async (profile: Profile): Promise<{ success: boolean; error?: string }> => {
      const supabase = createClient();
      if (!supabase || !userId) return { success: false, error: 'Not signed in.' };

      // `profiles.user_id` has a FK to `users(id)`. That row is normally
      // created by a DB trigger the moment someone signs up (see migration
      // 003), but if it ever misses — schema drift, a migration that hadn't
      // been pushed yet, etc. — the profile upsert below fails with a FK
      // violation and there was previously no way to recover: RLS only let
      // a client SELECT/UPDATE its own `users` row, not INSERT one. Self-heal
      // by upserting it here (migration 009 grants the INSERT policy this
      // needs) before writing the profile.
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.email) {
        await supabase
          .from('users')
          .upsert({ id: userId, email: authUser.email }, { onConflict: 'id', ignoreDuplicates: true });
      }

      // Omit a blank id on first insert so Postgres assigns one; keep it on
      // updates so the upsert targets the existing row.
      const { id, ...rest } = profile;
      const payload = id ? { id, ...rest, user_id: userId } : { ...rest, user_id: userId };
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select('*')
        .single();
      if (error) return { success: false, error: error.message };
      setUser(data as Profile);
      return { success: true };
    },
    [userId]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isLoading,
        isAuthenticated: userId !== null,
        isSupabaseAuth: true,
        loginWithPassword,
        sendMagicLink,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Decided once at module load based on NEXT_PUBLIC_* env vars — never
  // toggles mid-session, so it's safe to pick the provider implementation
  // with a plain if instead of switching hooks conditionally.
  if (isSupabaseConfigured()) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }
  return <MockAuthProvider>{children}</MockAuthProvider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
