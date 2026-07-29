'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  UsersIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useCurrencySafe } from '@/context/CurrencyContext';
import { fetchDashboardStats, DashboardStats } from '@/lib/dashboard';
import { showErrorToast } from '@/lib/toast';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import ExpensesTrendChart from '@/components/dashboard/ExpensesTrendChart';
import ProductSalesPieChart from '@/components/dashboard/ProductSalesPieChart';
import ProfitLossChart from '@/components/dashboard/ProfitLossChart';

export default function DashboardPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      console.log('📊 Dashboard data loaded:', data);
      console.log('📊 Top Products:', data.topProducts);
      setStats(data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      showErrorToast(error.message || 'Failed to load dashboard');
      if (error.message.includes('401')) {
        localStorage.removeItem('access_token');
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg outline-none p-4 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm">Failed to load dashboard data</p>
        <button
          onClick={loadDashboard}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      href: '/dashboard/sales',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/dashboard/sales',
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: CreditCardIcon,
      color: 'bg-red-500',
      href: '/dashboard/expenses',
    },
    {
      title: 'Total Profit',
      value: stats.totalRevenue - stats.totalExpenses,
      icon: stats.totalRevenue - stats.totalExpenses >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: stats.totalRevenue - stats.totalExpenses >= 0 ? 'bg-purple-500' : 'bg-orange-500',
      href: '/dashboard/reports',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: UsersIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/customers',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: 'bg-indigo-500',
      href: '/dashboard/products',
    },
    {
      title: 'Total Purchases',
      value: stats.totalPurchases || 0,
      icon: TruckIcon,
      color: 'bg-teal-500',
      href: '/dashboard/purchases',
    },
  ];

  const profit = stats.totalRevenue - stats.totalExpenses;
  const loss = profit < 0 ? Math.abs(profit) : 0;
  const totalProfit = profit > 0 ? profit : 0;

  // Ensure topProducts is an array
  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];
  console.log('📊 Top Products passed to chart:', topProducts);

  return (
    <div className="space-y-6 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your business performance</p>
        </div>
        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isNegative = stat.title === 'Total Profit' && stat.value < 0;
          return (
            <div
              key={stat.title}
              onClick={() => router.push(stat.href)}
              className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 rounded-lg outline-none ${stat.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{stat.title}</p>
                  <p className={`text-sm sm:text-base md:text-xl font-bold mt-0.5 truncate ${
                    isNegative ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {stat.title === 'Total Revenue' || stat.title === 'Total Expenses' || stat.title === 'Total Profit'
                      ? formatCurrency(stat.value)
                      : stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Sales Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 7 days</p>
            </div>
          </div>
          <div className="h-[200px] sm:h-[250px]">
            <SalesTrendChart data={stats.salesTrend || []} />
          </div>
        </div>

        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Expenses Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 7 days</p>
            </div>
          </div>
          <div className="h-[200px] sm:h-[250px]">
            <ExpensesTrendChart data={stats.expenseTrend || []} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Top Products</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">By sales amount</p>
            </div>
          </div>
          <div className="h-[200px] sm:h-[250px]">
            <ProductSalesPieChart data={topProducts} />
          </div>
        </div>

        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Profit vs Loss</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Overall performance</p>
            </div>
          </div>
          <div className="h-[200px] sm:h-[250px]">
            <ProfitLossChart profit={totalProfit} loss={loss} />
          </div>
        </div>
      </div>
    </div>
  );
}
