'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
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
      const token = localStorage.getItem('access_token');
      if (token) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
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

        const token = response?.data?.access_token || response?.access_token;
        const user = response?.data?.user || response?.user;

        if (!token) {
          throw new Error('No access token received');
        }

        localStorage.setItem('access_token', token);
        setUser(user);

        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }

        showWelcomeBackToast(user?.name || 'User');
        setTimeout(() => router.push('/dashboard'), 500);
      } catch (error: unknown) {
        console.error('Login error:', error);

        if (isApiError(error) && error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
        } else {
          const message = error instanceof Error ? error.message : 'Invalid email or password';
          if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('invalid')) {
            setFieldErrors({ email: 'Incorrect email or password. Please try again.' });
          } else {
            setLoginError(message);
            showErrorToast(message);
          }
        }
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
      <Toaster position="bottom-center" />
      <TallyLoginForm
        onSubmit={handleLogin}
        loading={isLoggingIn}
        error={loginError}
      />
    </>
  );
}