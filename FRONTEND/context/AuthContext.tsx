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

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  const logout = useCallback(() => {
    // ✅ Prevent multiple logout calls
    if (isLoggingOut.current || hasLoggedOut.current) {
      console.log('⏳ Logout already in progress, skipping...');
      return;
    }

    isLoggingOut.current = true;
    hasLoggedOut.current = true;

    const username = user?.name || 'User';
    
    // ✅ Show logout toast only once
    showLogoutToast(`Goodbye, ${username}!`, 'See you soon!');

    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('remembered_email');
    localStorage.removeItem('remember_me');

    // ✅ Redirect to login
    setTimeout(() => {
      router.push('/');
    }, 300);

    // ✅ Reset flags after navigation
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    logoutTimeoutRef.current = setTimeout(() => {
      isLoggingOut.current = false;
      hasLoggedOut.current = false;
      logoutTimeoutRef.current = null;
    }, 1000);
  }, [user, router]);

  const refreshUser = useCallback(async () => {
    if (!user || isLoggingOut.current || hasLoggedOut.current) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
      } else if (res.status === 401) {
        if (!isLoggingOut.current && !hasLoggedOut.current) {
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