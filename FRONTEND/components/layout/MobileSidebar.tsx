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
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useThemeSafe } from '@/context/ThemeContext';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const theme = useThemeSafe();
  const isDark = theme?.isDark || false;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64
        transition-transform duration-300 ease-in-out
        ${isDark ? 'bg-slate-900' : 'bg-white'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
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
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <XMarkIcon className={`h-6 w-6 ${isDark ? 'text-white' : 'text-slate-700'}`} />
            </button>
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
      </div>
    </>
  );
}
