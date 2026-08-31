'use client';

import { useState } from 'react';
import { useSalesHistory } from '@/hooks/sales/useSalesHistory';
import { SalesHistoryTable } from '@/components/sales/tables/SalesHistoryTable';
import { SalesHistoryFilters } from '@/components/sales/SalesHistoryFilters';
import { SalesHistoryStats } from '@/components/sales/SalesHistoryStats';

export default function SalesHistoryPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
  });
  const { sales, loading, stats, pagination } = useSalesHistory(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View all past sales transactions</p>
        </div>
      </div>

      <SalesHistoryStats stats={stats} loading={loading} />
      <SalesHistoryFilters filters={filters} setFilters={setFilters} />
      <SalesHistoryTable 
        sales={sales} 
        loading={loading} 
        pagination={pagination} 
      />
    </div>
  );
}
