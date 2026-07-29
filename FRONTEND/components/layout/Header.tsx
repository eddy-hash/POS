'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  BellIcon, 
  UserCircleIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  setIsMobileOpen: (value: boolean) => void;
  isMobileOpen: boolean;
}

export default function Header({ setIsMobileOpen, isMobileOpen }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname?.replace('/dashboard/', '') || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileOpen ? (
              <XMarkIcon className="h-6 w-6 text-slate-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-slate-600" />
            )}
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-500">Admin</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-slate-50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <BellIcon className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <UserCircleIcon className="h-8 w-8 text-slate-400" />
              <span className="hidden sm:inline text-sm font-medium text-slate-700">Admin</span>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
                  Settings
                </button>
                <hr className="my-1 border-slate-200" />
                <button 
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    router.push('/');
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
