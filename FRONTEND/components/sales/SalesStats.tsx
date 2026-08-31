'use client';

import { CurrencyDollarIcon, ShoppingBagIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface SalesStatsProps {
  stats: {
    totalSales: number;
    totalRevenue: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
  loading?: boolean;
}

export function SalesStats({ stats, loading }: SalesStatsProps) {
  const items = [
    {
      label: 'Total Revenue',
      value: `TSh ${stats.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Completed Sales',
      value: stats.totalSales,
      icon: ShoppingBagIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers || 0,
      icon: UsersIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Average Order',
      value: `TSh ${stats.averageOrderValue.toFixed(2)}`,
      icon: ChartBarIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
