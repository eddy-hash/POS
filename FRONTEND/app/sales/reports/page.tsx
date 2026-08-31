'use client';

import { useState } from 'react';
import { useSalesReports } from '@/hooks/sales/useSalesReports';
import { ReportFilters } from '@/components/sales/reports/ReportFilters';
import { ReportCharts } from '@/components/sales/reports/ReportCharts';
import { ReportSummary } from '@/components/sales/reports/ReportSummary';
import { TopProducts } from '@/components/sales/reports/TopProducts';
import { DailySales } from '@/components/sales/reports/DailySales';

export default function SalesReportsPage() {
  const [period, setPeriod] = useState('today');
  const { data, loading } = useSalesReports(period);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Analytics and insights</p>
        </div>
      </div>

      <ReportFilters period={period} setPeriod={setPeriod} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <ReportSummary data={data} loading={loading} />
          <ReportCharts data={data} loading={loading} />
          <DailySales data={data.daily} loading={loading} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TopProducts data={data.topProducts} loading={loading} />
        </div>
      </div>
    </div>
  );
}
