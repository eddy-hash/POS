'use client';
import StatCard from '@/components/reports/StatCard';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

interface StatsGridProps {
  stats: {
    totalRevenue: number;
    totalSales: number;
    totalExpenses: number;
    profit: number;
    totalCustomers: number;
    totalProducts: number;
  };
  formatCurrency: (value: number) => string;
}

export function StatsGrid({ stats, formatCurrency }: StatsGridProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      trend: stats.totalRevenue > 0 ? '+12.5%' : '+0%',
      trendUp: true,
      isCurrency: true,   // 
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      trend: stats.totalSales > 0 ? '+8.3%' : '+0%',
      trendUp: true,
      isCurrency: false,  //  count
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: CreditCardIcon,
      color: 'bg-red-500',
      trend: stats.totalExpenses > 0 ? '-3.2%' : '+0%',
      trendUp: false,
      isCurrency: true,   // count
    },
    {
      title: 'Net Profit',
      value: stats.profit,
      icon: ChartBarIcon,
      color: stats.profit >= 0 ? 'bg-purple-500' : 'bg-orange-500',
      trend: stats.profit >= 0 ? '+15.8%' : '-4.2%',
      trendUp: stats.profit >= 0,
      isCurrency: true,   
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: UsersIcon,
      color: 'bg-yellow-500',
      trend: stats.totalCustomers > 0 ? '+5.2%' : '+0%',
      trendUp: true,
      isCurrency: false,  // count
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      trend: stats.totalProducts > 0 ? '+2.1%' : '+0%',
      trendUp: true,
      isCurrency: false,  // count
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} formatCurrency={formatCurrency} />
      ))}
    </div>
  );
}