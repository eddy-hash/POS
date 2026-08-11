'use client';

import { useCurrencySafe } from '@/context/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number | string;
  className?: string;
  abbreviate?: boolean;
  fallback?: string;
}

export default function CurrencyDisplay({
  amount,
  className = '',
  abbreviate = false,
  fallback = '0',
}: CurrencyDisplayProps) {
  const currencyContext = useCurrencySafe();
  
  const currency = currencyContext?.currency || 'TZS';
  const symbols = currencyContext?.symbols || {};
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `${currency} ${amount}`);
  const formatCurrencyShort = currencyContext?.formatCurrencyShort || ((amount: number) => `${currency} ${amount}`);
  
  // Safely convert to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (numAmount === undefined || numAmount === null || isNaN(numAmount)) {
    return <span className={className}>{fallback}</span>;
  }

  const displayValue = abbreviate 
    ? formatCurrencyShort(numAmount) 
    : formatCurrency(numAmount);

  return <span className={className}>{displayValue}</span>;
}
