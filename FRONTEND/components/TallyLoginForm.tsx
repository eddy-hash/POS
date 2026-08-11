'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightEndOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface TallyLoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function TallyLoginForm({ 
  onSubmit, 
  loading = false, 
  error = null,
}: TallyLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || loading) return;
    
    setIsLoading(true);
    try {
      await onSubmit(email, password, rememberMe);
    } catch (err) {
      console.error('❌ onSubmit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || loading;

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 py-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100">
        {/* Logo at Top Center - Inside Card */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image 
                src="/Logo.png" 
                alt="Logo" 
                fill 
                className="object-contain" 
                priority 
                sizes="(max-width: 640px) 80px, 96px" 
              />
            </div>
          </div>
          <h2 className="font-bold text-slate-900 text-2xl sm:text-3xl">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-slate-900 placeholder:text-slate-400"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-slate-900 placeholder:text-slate-400"
                required
                disabled={isSubmitting}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create one now
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-xs text-slate-500">
            Demo: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">admin@com</span> / <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
