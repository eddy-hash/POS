'use client';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useState, useEffect } from 'react';
import { useThemeSafe } from '@/context/ThemeContext';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  isMobile: boolean;
}

export default function Navbar({ sidebarOpen, setSidebarOpen, isMobile }: NavbarProps) {
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const theme = useThemeSafe();
  const isDark = theme?.isDark || false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/dashboard/products': 'Products',
      '/dashboard/products/new': 'Add Product',
      '/dashboard/sales': 'Sales',
      '/dashboard/sales/new': 'New Sale',
      '/dashboard/purchases': 'Purchases',
      '/dashboard/customers': 'Customers',
      '/dashboard/reports': 'Reports',
      '/dashboard/settings': 'Settings',
    };
    return titles[pathname] || 'Smart POS';
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 right-0 z-20 h-16 left-0 bg-white/90 border-b border-slate-200">
        <div className="px-4 h-full flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  const navBase = `
    fixed top-0 right-0 z-20 h-16
    border-b shadow-sm backdrop-blur-md transition-all duration-300
    ${isDark 
      ? 'bg-slate-900/95 border-slate-700' 
      : 'bg-white/95 border-slate-200'
    }
    ${isMobile ? 'left-0' : 'left-64'}
  `;

  return (
    <nav className={navBase}>
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          )}
          <div className="min-w-0">
            <h1 className={`text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {getPageTitle()}
            </h1>
            {!isMobile && (
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Point of Sale System
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`hidden sm:block text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <ThemeToggle size="sm" />
          <NotificationsDropdown size="sm" />
          <ProfileDropdown size="sm" />
        </div>
      </div>
    </nav>
  );
}
