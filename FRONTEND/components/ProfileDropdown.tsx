'use client';

import { useState, useEffect, useRef } from 'react';
import { UserIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken, getUser } from '@/lib/auth';
import { showSuccessToast } from '@/lib/toast';

interface ProfileDropdownProps {
  size?: 'sm' | 'md';
}

export default function ProfileDropdown({ size = 'md' }: ProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

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
    removeAuthToken();
    showSuccessToast('Logged out successfully');
    router.push('/');
  };

  const iconSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${buttonSize}`}
        aria-label="Profile"
      >
        <UserIcon className={`${iconSize} text-slate-700 dark:text-white`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'No email'}
            </p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/settings/profile');
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
            >
              <UserCircleIcon className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
