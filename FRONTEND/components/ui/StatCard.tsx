'use client';

import { useCurrencySafe } from '@/context/CurrencyContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  trendLabel?: string;
  abbreviate?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'bg-blue-500', 
  trend, 
  trendLabel,
  abbreviate = true 
}: StatCardProps) {
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);

  // Ensure value is a number and not NaN
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{title}</p>
      </div>
      <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
        {formatCurrency(safeValue, abbreviate)}
      </p>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{trendLabel || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
}
