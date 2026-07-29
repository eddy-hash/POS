'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/lib/hooks/useSidebar';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    isMobile,
    isTablet,
  } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      <div className={`
        transition-all duration-300
        ${isMobile || isTablet ? 'ml-0' : 'ml-64'}
      `}>
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={toggleSidebar}
          isMobile={isMobile}
        />
        <main className={`
          pt-16 px-4 sm:px-6 lg:px-8 pb-8
          ${isMobile || isTablet ? 'ml-0' : ''}
        `}>
          {children}
        </main>
      </div>
    </div>
  );
}
