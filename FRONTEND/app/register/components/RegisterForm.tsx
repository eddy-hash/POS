'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, EnvelopeIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import PasswordField from './PasswordField';
import { usePasswordGenerator } from './usePasswordGenerator';
import { useRegister } from '../hooks/useRegister';
import SuccessModal from '@/components/ui/SuccessModal';

export default function RegisterForm() {
  const {
    form,
    updateField,
    loading,
    error,
    showModal,
    handleSubmit,
    closeModal,
  } = useRegister();

  // Password generator (local state inside this component)
  const { password, setPassword, strength, generatePassword } = usePasswordGenerator('');

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    updateField('password', value);
  };

  const handlePasswordGenerate = () => {
    const newPass = generatePassword();
    setPassword(newPass);
    updateField('password', newPass);
  };

  return (
    <>
      <SuccessModal
        isOpen={showModal}
        onClose={closeModal}
        title={`Welcome, ${form.name}!`}
        message="Your account has been created successfully. You can now log in."
        buttonText="Go to Login"
        onButtonClick={closeModal}
      />

      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 py-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority sizes="(max-width: 640px) 80px, 96px" />
              </div>
            </div>
            <h2 className="font-bold text-slate-900 text-2xl sm:text-3xl">Create Account</h2>
            <p className="text-slate-500 mt-2 text-sm">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field with strength & generator */}
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              showStrength
              strength={strength}
              generatePassword={handlePasswordGenerate}
              disabled={loading}
              required
              minLength={8}
            />

            {/* Confirm Password */}
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={(v) => updateField('confirmPassword', v)}
              placeholder="Confirm your password"
              disabled={loading}
              required
              confirm
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
