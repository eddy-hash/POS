'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import TallyLoginForm from '@/components/TallyLoginForm';
import { showWelcomeBackToast, showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import { useAuth } from '@/context/AuthContext';          // ← add

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();                            // ← add
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const data = await api.post('/auth/login', { email, password }, null);

      const token = data?.access_token || data?.data?.access_token;
      const user = data?.user || data?.data?.user;

      if (token) {
        localStorage.setItem('access_token', token);

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));  // ← add: persist user
          setUser(user);                                        // ← add: sync context immediately
        }

        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }

        const username = user?.name || 'User';
        showWelcomeBackToast(username);

        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Invalid email or password';
      setLoginError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEFE6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F6F54]"></div>
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