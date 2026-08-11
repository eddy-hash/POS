'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import TallyLoginForm from '@/components/TallyLoginForm';
import { showWelcomeBackToast, showErrorToast } from '@/lib/toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
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
      setIsLoggingIn(true);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const rawText = await response.text();
        console.log('📄 Raw response:', rawText);

        let data = {};
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch (e) {
          console.error('❌ Failed to parse JSON:', e);
          throw new Error('Server returned invalid response format');
        }

        console.log('📦 Parsed response:', data);

        if (!response.ok) {
          throw new Error((data as any).message || (data as any).error || `Server error: ${response.status}`);
        }

        // Extract token from nested structure
        const nestedData = (data as any).data || {};
        const token = nestedData.access_token || (data as any).access_token;
        const user = nestedData.user || (data as any).user;

        console.log('🔑 Token found:', !!token);

        if (!token) {
          console.error('❌ No token. Response keys:', Object.keys(data));
          throw new Error('No access token received. Please check API response format.');
        }

        localStorage.setItem('access_token', token);
        console.log('💾 Token stored successfully');

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('👤 User data stored:', user.name || user.email);
        }

        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }

        // ✅ Show welcome toast
        showWelcomeBackToast(user?.name || 'User');

        setTimeout(() => {
          router.push('/dashboard');
        }, 500);

      } catch (error: any) {
        console.error('❌ Login error:', error);
        const errorMsg = error.message || 'Invalid email or password';
        setLoginError(errorMsg);
        // ✅ Show error toast
        showErrorToast(errorMsg);
      } finally {
        if (isMounted.current) {
          setIsLoggingIn(false);
        }
      }
    },
    [isLoggingIn, router]
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
