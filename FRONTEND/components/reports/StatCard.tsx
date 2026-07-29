'use client';

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { useCurrencySafe } from '@/context/CurrencyContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend: string;
  trendUp: boolean;
  isCurrency?: boolean; // <-- NEW: default true
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendUp,
  isCurrency = true, // default to true so existing usage stays the same
}: StatCardProps) {
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  
  // Determine display value
  const displayValue = isCurrency 
    ? formatCurrency(value) 
    : value.toLocaleString();

  const isProfit = title === 'Net Profit';
  const isNegative = isProfit && value < 0;

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 sm:p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${
          trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {trendUp ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div className="mt-2 sm:mt-3">
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-sm sm:text-base md:text-lg font-bold mt-0.5 ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
          {displayValue}
        </p>
      </div>
    </div>
  );
}