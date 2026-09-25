'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TallyLoginForm from '@/components/TallyLoginForm';
import { showWelcomeBackToast, showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import { useAuth } from '@/context/AuthContext';

interface ApiError extends Error {
  fieldErrors?: Record<string, string>;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'fieldErrors' in error &&
    typeof (error as ApiError).fieldErrors === 'object'
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      const token = localStorage.getItem('access_token');
      if (token && !next) {
        router.replace('/dashboard');
      }
    } catch {
      // ignore
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [router]);

  const handleLogin = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      if (isLoggingIn) return;

      setLoginError(null);
      setFieldErrors({});
      setIsLoggingIn(true);

      try {
        const response = await api.post('/auth/login', { email, password }, null);

        const payload =
          (response as any)?.data?.data ??
          (response as any)?.data ??
          response;

        const token = payload?.access_token;
        const user = payload?.user;

        if (!token) throw new Error('No access token received');

        localStorage.setItem('access_token', token);

        const oneDay = 60 * 60 * 24;
        document.cookie = `access_token=${token}; path=/; max-age=${oneDay}; SameSite=Lax`;
        if (user?.role) {
          document.cookie = `user_role=${user.role}; path=/; max-age=${oneDay}; SameSite=Lax`;
        }
        if (user?.name) {
          document.cookie = `user_name=${encodeURIComponent(user.name)}; path=/; max-age=${oneDay}; SameSite=Lax`;
        }

        if (user) localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        if (rememberMe) localStorage.setItem('remember_me', 'true');
        else localStorage.removeItem('remember_me');

        showWelcomeBackToast(user?.name || 'User');

        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || '/dashboard';
        setTimeout(() => router.replace(next), 500);
      } catch (error: unknown) {
        let raw = 'Invalid email or password';
        if (isApiError(error) && error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
          raw = Object.values(error.fieldErrors)[0] || raw;
        } else if (error instanceof Error && error.message) {
          raw = error.message;
        }
        const lower = raw.toLowerCase();
        const friendly =
          lower.includes('invalid') ||
          lower.includes('not found') ||
          lower.includes('credential') ||
          lower.includes('unauthorized')
            ? 'Incorrect email or password. Please try again.'
            : raw;
        setLoginError(friendly);
        setFieldErrors({ email: friendly, password: friendly });
        showErrorToast('Login failed', friendly);
      } finally {
        if (isMounted.current) {
          setIsLoggingIn(false);
        }
      }
    },
    [isLoggingIn, router, setUser]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
            <TallyLoginForm
        onSubmit={handleLogin}
        loading={isLoggingIn}
        error={loginError}
        fieldErrors={fieldErrors}
      />
    </>
  );
}
