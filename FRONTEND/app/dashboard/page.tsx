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
import { fetchDashboardStats } from '@/lib/dashboard';
import { showErrorToast } from '@/lib/toast';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import ExpensesTrendChart from '@/components/dashboard/ExpensesTrendChart';
import ProductSalesPieChart from '@/components/dashboard/ProductSalesPieChart';
import ProfitLossChart from '@/components/dashboard/ProfitLossChart';

export default function DashboardPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const currency = currencyContext?.currency || 'TZS';
  const symbols = currencyContext?.symbols || {};
  const rates = currencyContext?.rates || {};

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats(currency);
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

  useEffect(() => {
    const handleCurrencyChange = () => {
      loadDashboard();
    };
    window.addEventListener('currencyChanged', handleCurrencyChange);
    window.addEventListener('refreshDashboard', loadDashboard);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
      window.removeEventListener('refreshDashboard', loadDashboard);
    };
  }, []);

  useEffect(() => {
    if (currency) {
      loadDashboard();
    }
  }, [currency]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm">Failed to load dashboard</p>
        <button onClick={loadDashboard} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
          Retry
        </button>
      </div>
    );
  }

  const profit = stats.profit || 0;
  const totalProfit = profit > 0 ? profit : 0;
  const loss = profit < 0 ? Math.abs(profit) : 0;

  // ✅ Use backend formatted values
  const f = stats.formatted || {};
  const fFull = stats.formattedFull || {};
  const useAbbreviated = currency === 'TZS';

  let displayRevenue = '0';
  let displayExpenses = '0';
  let displayProfit = '0';

  if (useAbbreviated) {
    // TZS: Use abbreviated (K/M/B)
    displayRevenue = f.totalRevenue || `${symbols[currency] || currency} ${(stats.totalRevenue || 0).toLocaleString()}`;
    displayExpenses = f.totalExpenses || `${symbols[currency] || currency} ${(stats.totalExpenses || 0).toLocaleString()}`;
    displayProfit = f.profit || `${symbols[currency] || currency} ${(profit || 0).toLocaleString()}`;
  } else {
    // Non-TZS: Use full format with 2 decimal places
    displayRevenue = fFull.totalRevenue || f.totalRevenue || `${symbols[currency] || currency} ${(stats.totalRevenue || 0).toFixed(2)}`;
    displayExpenses = fFull.totalExpenses || f.totalExpenses || `${symbols[currency] || currency} ${(stats.totalExpenses || 0).toFixed(2)}`;
    displayProfit = fFull.profit || f.profit || `${symbols[currency] || currency} ${(profit || 0).toFixed(2)}`;
  }

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
      title: 'Total Profit',
      displayValue: displayProfit,
      icon: profit >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: profit >= 0 ? 'bg-purple-500' : 'bg-orange-500',
      href: '/dashboard/reports',
    },
    {
      title: 'Total Customers',
      displayValue: stats.totalCustomers?.toLocaleString() || '0',
      icon: UsersIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/customers',
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

  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];

  return (
    <div className="space-y-6 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your business performance</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Displaying in: {currency} {symbols[currency] || ''}
            {currency === 'TZS' && ` (1 USD = ${(rates.USD || 2600).toLocaleString()} TZS)`}
          </p>
        </div>
        <button onClick={loadDashboard} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
          <ArrowPathIcon className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isNegative = stat.title === 'Total Profit' && profit < 0;
          return (
            <div
              key={stat.title}
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
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Sales Trend</h3>
          <div className="h-[200px] sm:h-[250px]">
            <SalesTrendChart data={stats.salesTrend || []} />
          </div>
        </div>

        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Expenses Trend</h3>
          <div className="h-[200px] sm:h-[250px]">
            <ExpensesTrendChart data={stats.expenseTrend || []} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Top Products</h3>
          <div className="h-[200px] sm:h-[250px]">
            <ProductSalesPieChart data={topProducts} />
          </div>
        </div>

        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Profit vs Loss</h3>
          <div className="h-[200px] sm:h-[250px]">
            <ProfitLossChart profit={totalProfit} loss={loss} />
          </div>
        </div>
      </div>
    </div>
  );
}
