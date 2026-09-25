'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { showLogoutToast, showErrorToast } from '@/lib/toast';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isLoggingOut = useRef(false);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoggedOut = useRef(false);

  // ─── Load user from localStorage on mount ──────────────────────
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        setUser(parsed);

        // ─── Re-sync cookies so proxy.ts (server-side) sees us ───
        // Cookies are set on login but can be cleared, expire, or be
        // missing in a new tab. Re-hydrating here keeps the server-side
        // route guard and the client in sync.
        const token = localStorage.getItem('access_token');
        const oneDay = 60 * 60 * 24;
        if (token) {
          document.cookie = `access_token=${token}; path=/; max-age=${oneDay}; SameSite=Lax`;
        }
        if (parsed?.role) {
          document.cookie = `user_role=${parsed.role}; path=/; max-age=${oneDay}; SameSite=Lax`;
        }
        if (parsed?.name) {
          document.cookie = `user_name=${encodeURIComponent(parsed.name)}; path=/; max-age=${oneDay}; SameSite=Lax`;
        }
      }
    } catch {
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Persist user to localStorage ──────────────────────────────
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ─── Cleanup timeout on unmount ────────────────────────────────
  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────
  const logout = useCallback(() => {
    if (isLoggingOut.current || hasLoggedOut.current) {
      return;
    }

    isLoggingOut.current = true;
    hasLoggedOut.current = true;

    const username = user?.name || 'User';
    showLogoutToast(`Goodbye, ${username}!`, 'See you soon!');

    setUser(null);
    localStorage.removeItem('access_token');
    // Clear auth cookies so middleware won't think we're still logged in
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    document.cookie = 'user_name=; path=/; max-age=0';
    localStorage.removeItem('user');
    localStorage.removeItem('remembered_email');
    localStorage.removeItem('remember_me');

    setTimeout(() => {
      router.push('/');
    }, 300);

    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    logoutTimeoutRef.current = setTimeout(() => {
      isLoggingOut.current = false;
      hasLoggedOut.current = false;
      logoutTimeoutRef.current = null;
    }, 1000);
  }, [user, router]);

  // ─── Refresh user data ──────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!user || isLoggingOut.current || hasLoggedOut.current) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // ✅ Use relative URL – goes through Nginx
      const API_URL = ''; // empty → relative to current origin
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        // Unwrap the double-nested ResponseInterceptor envelope
        let fresh: any = data;
        let depth = 0;
        while (fresh && typeof fresh === 'object' && 'data' in fresh && depth < 5) {
          const inner = (fresh as any).data;
          if (!inner || typeof inner !== 'object') break;
          fresh = inner;
          depth++;
        }

        if (!isLoggingOut.current && !hasLoggedOut.current) {
          // ⚠️ /users/profile is a slim payload (no role/role_id).
          // MERGE so we never lose role / role_id / isAdmin from login.
          setUser((prev) => {
            const merged = { ...(prev || {}), ...fresh };
            try {
              localStorage.setItem('user', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } else if (res.status === 401) {
        // Only log out if the token is actually gone/expired.
        // A transient 401 shouldn't nuke an active session.
        const stillHasToken = !!localStorage.getItem('access_token');
        if (!stillHasToken && !isLoggingOut.current && !hasLoggedOut.current) {
          logout();
        }
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      if (!isLoggingOut.current && !hasLoggedOut.current) {
        showErrorToast('Could not refresh user data', 'Please try again later');
      }
    }
  }, [user, logout]);

  const value = useMemo(
    () => ({ user, setUser, logout, isLoading, refreshUser }),
    [user, isLoading, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
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