'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  UsersIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

interface StatCardsProps {
  stats: any;
  displayRevenue: string;
  displayExpenses: string;
  displayProfit: string;
  profit: number;
}

export function StatCards({ stats, displayRevenue, displayExpenses, displayProfit, profit }: StatCardsProps) {
  const router = useRouter();

  const statCards = [
    {
      title: 'Total Revenue',
      displayValue: displayRevenue,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      href: '/dashboard/sales',
    },
    {
      title: 'Total Sales',
      displayValue: stats.totalSales?.toLocaleString() || '0',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/dashboard/sales',
    },
    {
      title: 'Total Expenses',
      displayValue: displayExpenses,
      icon: CreditCardIcon,
      color: 'bg-red-500',
      href: '/dashboard/expenses',
    },
    {
      title: profit >= 0 ? 'Total Profit' : 'Total Loss',
      displayValue:
        profit >= 0
          ? displayProfit
          : displayProfit.replace('-', ''),   // strip the minus — label says Loss
      icon: profit >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: profit >= 0 ? 'bg-purple-500' : 'bg-orange-500',
      href: '/dashboard/reports',
    },
    {
      title: 'Total Products',
      displayValue: stats.totalProducts?.toLocaleString() || '0',
      icon: CubeIcon,
      color: 'bg-indigo-500',
      href: '/dashboard/products',
    },
    {
      title: 'Total Purchases',
      displayValue: (stats.totalPurchases || 0).toLocaleString(),
      icon: TruckIcon,
      color: 'bg-teal-500',
      href: '/dashboard/purchases',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        const isNegative = stat.title === 'Total Profit' && profit < 0;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(stat.href)}
            className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{stat.title}</p>
                <p className={`text-sm sm:text-base md:text-xl font-bold mt-0.5 truncate ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {stat.displayValue}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
