'use client';

import { useCurrencySafe } from '@/context/CurrencyContext';

interface QuickInsightsProps {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCustomers: number;
  totalProducts: number;
  profit: number;
  lowStockCount: number;
}

export default function QuickInsights({
  totalSales,
  totalRevenue,
  totalExpenses,
  totalCustomers,
  totalProducts,
  profit,
  lowStockCount,
}: QuickInsightsProps) {
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  
  const avgTransaction = totalSales > 0 ? totalRevenue / totalSales : 0;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  const insights = [
    {
      title: 'Avg. Transaction',
      value: avgTransaction,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      formatter: formatCurrency,
    },
    {
      title: 'Profit Margin',
      value: profitMargin,
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      formatter: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      formatter: (v: number) => v.toString(),
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      formatter: (v: number) => v.toString(),
    },
  ];

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Quick Insights</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Key metrics at a glance</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`${insight.color} rounded-lg sm:rounded-xl p-3 sm:p-4`}>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{insight.title}</p>
            <p className={`text-sm sm:text-base md:text-lg font-bold ${insight.textColor}`}>
              {insight.formatter(insight.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
