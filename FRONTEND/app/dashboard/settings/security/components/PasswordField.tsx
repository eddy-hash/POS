'use client';
import { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete = 'off',
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  const inputClass = `w-full px-4 py-2.5 pl-11 pr-11 border rounded-xl outline-none transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
    error
      ? 'border-red-400 dark:border-red-500/70 ring-4 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500'
      : 'border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <ShieldCheckIcon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-slate-400'}`} />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClass}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs mt-2 animate-fadeIn">
          <ExclamationCircleIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
