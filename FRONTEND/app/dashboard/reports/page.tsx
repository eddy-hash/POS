'use client';
import { useState } from 'react';
import { useCurrencySafe } from '@/context/CurrencyContext';
import { useReports } from './hooks/useReports';
import { exportPDF, handlePrint } from './utils/exportUtils';
import { ReportHeader } from './ReportHeader';
import { StatsGrid } from './StatsGrid';
import { ChartsGrid } from './ChartsGrid';
import MonthlyPerformance from './MonthlyPerformance';
import RecentActivitySection from './RecentActivitySection';
import QuickInsights from '@/components/reports/QuickInsights';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const { stats, loading, refetch } = useReports(dateRange);
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || 
    ((amount: number) => `TZS ${amount.toLocaleString()}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      <ReportHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={refetch}
        onExportPDF={() => exportPDF(dateRange)}
        onPrint={handlePrint}
      />
      <StatsGrid stats={stats} formatCurrency={formatCurrency} />
      <ChartsGrid stats={stats} formatCurrency={formatCurrency} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <MonthlyPerformance monthlyStats={stats.monthlyStats} formatCurrency={formatCurrency} />
        <QuickInsights
          totalSales={stats.totalSales}
          totalRevenue={stats.totalRevenue}
          totalExpenses={stats.totalExpenses}
          totalCustomers={stats.totalCustomers}
          totalProducts={stats.totalProducts}
          profit={stats.profit}
          lowStockCount={stats.lowStockItems?.length || 0}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <RecentActivitySection
          title="Recent Sales"
          items={stats.recentSales}
          formatCurrency={formatCurrency}
          type="sales"
        />
        <RecentActivitySection
          title="Recent Expenses"
          items={stats.recentExpenses}
          formatCurrency={formatCurrency}
          type="expenses"
        />
      </div>
    </div>
  );
}