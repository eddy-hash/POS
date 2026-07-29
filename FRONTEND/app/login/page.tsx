'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import TallyLoginForm from '@/components/TallyLoginForm';
import { showWelcomeToast, showErrorToast } from '@/lib/toast';

export default function LoginPage() {
  const router = useRouter();
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
        showWelcomeToast('Welcome Back!', 'You have been logged in successfully');
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
