'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { name: 'Products', icon: CubeIcon, href: '/dashboard/products' },
  { name: 'Sales', icon: ShoppingBagIcon, href: '/dashboard/sales' },
  { name: 'Expenses', icon: CreditCardIcon, href: '/dashboard/expenses' },
  { name: 'Purchases', icon: TruckIcon, href: '/dashboard/purchases' },
  { name: 'Customers', icon: UsersIcon, href: '/dashboard/customers' },
  { name: 'Reports', icon: ChartBarIcon, href: '/dashboard/reports' },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/dashboard/settings' },
];

export default function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount and listen for changes
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'dark' || (!stored && prefersDark);
    setIsDark(initial);
    setMounted(true);

    // Listen for theme changes from other components (e.g., SettingsPage)
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  // Sync the html class when isDark changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark, mounted]);

  if (!mounted) {
    return null;
  }

  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-full w-64
    transition-transform duration-300 ease-in-out
    ${isDark 
      ? 'bg-slate-900 border-r border-slate-700' 
      : 'bg-white border-r border-slate-200'
    }
    ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
  `;

  const overlayClasses = `
    fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
    ${isMobile && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `;

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/Logo.png"
                alt="Smart POS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Smart POS
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive
                      ? isDark 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'bg-blue-50 text-blue-700'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className={`px-4 py-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Point of Sale System v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}