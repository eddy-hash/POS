#!/bin/bash
set -e

cat > app/providers.tsx << 'EOF'
'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </ThemeProvider>
  );
}
EOF

cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart POS',
  description: 'Point of Sale System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
EOF

cat > context/ThemeContext.tsx << 'EOF'
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'dark' || (!stored && prefersDark);
    setIsDark(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
EOF

cat > app/dashboard/layout.tsx << 'EOF'
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
EOF

echo "✅ All files written. Cleaning cache and restarting..."
rm -rf .next
sudo fuser -k 3000/tcp 2>/dev/null || true
npm run dev
