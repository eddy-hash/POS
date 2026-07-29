// components/dashboard/stats-grid.tsx
'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Wallet,
  AlertTriangle,
} from 'lucide-react';

const stats = [
  { title: "Today's Sales", value: "TSh 2,450,000", change: "+12.5%", icon: ShoppingBag, trend: 'up' as const },
  { title: "Today's Orders", value: "48", change: "+8.2%", icon: Package, trend: 'up' as const },
  { title: "Revenue", value: "TSh 18.4M", change: "+23.1%", icon: DollarSign, trend: 'up' as const },
  { title: "Profit", value: "TSh 4.2M", change: "+15.3%", icon: TrendingUp, trend: 'up' as const },
  { title: "Customers", value: "1,284", change: "+5.7%", icon: Users, trend: 'up' as const },
  { title: "Products", value: "342", change: "+2.1%", icon: Package, trend: 'up' as const },
  { title: "Expenses", value: "TSh 1.2M", change: "-3.4%", icon: Wallet, trend: 'down' as const },
  { title: "Low Stock", value: "18", change: "+4", icon: AlertTriangle, trend: 'down' as const },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-3 sm:p-4 md:p-5 shadow-soft hover:shadow-medium transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10">
              <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <span className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] md:text-xs font-medium ${
              stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              <span>{stat.change}</span>
              <span>{stat.trend === 'up' ? '↑' : '↓'}</span>
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 md:mt-3">
            <p className="text-[9px] sm:text-xs md:text-sm font-medium text-slate-500 truncate">
              {stat.title}
            </p>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-900 truncate">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}