'use client';
import { motion } from 'framer-motion';
import { CubeIcon, CurrencyDollarIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ProductStatsProps {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  activeProducts: number;
}

export function ProductStats({ totalProducts, totalStock, lowStockItems, activeProducts }: ProductStatsProps) {
  const stats = [
    { label: 'Total Products', value: totalProducts, icon: CubeIcon, color: 'blue' },
    { label: 'Total Stock', value: totalStock, icon: CurrencyDollarIcon, color: 'green' },
    { label: 'Low Stock', value: lowStockItems, icon: TagIcon, color: 'yellow' },
    { label: 'Active', value: activeProducts, icon: CheckCircleIcon, color: 'emerald' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="font-display text-xl sm:text-2xl font-semibold mt-0.5 text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
