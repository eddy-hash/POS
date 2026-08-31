'use client'
import { useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  showStrength?: boolean;
  strength?: { score: number; label: string; color: string };
  generatePassword?: () => void;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  confirm?: boolean;
}

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  onFocus,
  showStrength = false,
  strength,
  generatePassword,
  disabled = false,
  required = true,
  minLength = 8,
  confirm = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {!confirm && generatePassword && (
          <button
            type="button"
            onClick={generatePassword}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            disabled={disabled}
          >
            <ArrowPathIcon className="h-3 w-3" />
            Generate
          </button>
        )}
      </div>
      <div className="relative">
        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={onFocus}
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white text-slate-900 placeholder:text-slate-400 placeholder:italic"
          required={required}
          disabled={disabled}
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {showStrength && strength && <PasswordStrengthIndicator password={value} strength={strength} />}
      <p className="text-xs text-slate-500">
        At least {minLength} chars with uppercase, lowercase, number, special char
      </p>
    </div>
  );
}
