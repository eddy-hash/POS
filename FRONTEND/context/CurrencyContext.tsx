'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatCurrency as formatCurrencyUtil } from '@/lib/formatCurrency';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number, abbreviate?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('TZS');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const formatCurrency = (amount: number, abbreviate: boolean = true) => {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return formatCurrencyUtil(safeAmount, currency, abbreviate);
  };

  // Save currency to localStorage when it changes
  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export function useCurrencySafe() {
  const context = useContext(CurrencyContext);
  return context;
}
