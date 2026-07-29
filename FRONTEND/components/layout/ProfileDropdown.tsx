'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, ArrowRightOnRectangleIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useThemeSafe } from '@/context/ThemeContext';
import { showSuccessToast } from '@/lib/toast';

interface ProfileDropdownProps {
  size?: 'sm' | 'md';
  isMobile?: boolean;
}

export default function ProfileDropdown({ size = 'md', isMobile = false }: ProfileDropdownProps) {
  const router = useRouter();
  const theme = useThemeSafe();
  const isDark = theme?.isDark || false;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('remember_me');
    // Show success toast with green checkmark
    showSuccessToast('Logged Out', 'You have been logged out successfully');
    setTimeout(() => router.push('/'), 1000);
  };

  const iconSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-lg transition-colors ${isDark ? 'hover:bg-blue-500/10' : 'hover:bg-slate-100'} ${buttonSize}`}
        aria-label="Profile"
      >
        <UserCircleIcon className={`${iconSize} ${isDark ? 'text-white' : 'text-slate-700'}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden z-50 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>My Account</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your profile</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/settings/profile');
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/settings');
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Cog6ToothIcon className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} my-1`} />
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
