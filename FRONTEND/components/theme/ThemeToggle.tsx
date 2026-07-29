'use client';

import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use the hook after mounting
  let isDark = false;
  let toggleTheme = () => {};
  
  try {
    const theme = useTheme();
    isDark = theme.isDark;
    toggleTheme = theme.toggleTheme;
  } catch (e) {
    if (!error) {
      console.warn('Theme context not available, using fallback');
      setError(true);
    }
  }

  const sizeClasses = size === 'sm' ? 'p-1.5 rounded-lg' : 'p-2 rounded-lg';

  const handleToggle = () => {
    console.log('Toggle clicked, current isDark:', isDark);
    if (toggleTheme) {
      toggleTheme();
    } else {
      // Fallback: manually toggle
      const newDark = !isDark;
      document.documentElement.classList.toggle('dark', newDark);
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      console.log('Fallback theme toggled to:', newDark ? 'dark' : 'light');
      // Force reload to apply changes
      window.location.reload();
    }
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <button className={`${sizeClasses} bg-slate-200 dark:bg-slate-700 animate-pulse`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses} transition-colors ${isDark ? 'hover:bg-blue-500/10' : 'hover:bg-slate-100'} ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`} />
      ) : (
        <MoonIcon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-slate-600`} />
      )}
    </button>
  );
}
