'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSales } from '@/hooks/sales/useSales';
import { SalesTable } from '@/components/sales/tables/SalesTable';
import { SalesStats } from '@/components/sales/SalesStats';

export default function SalesPage() {
  const [search, setSearch] = useState('');
  const { sales, loading, stats } = useSales({ search });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Point of Sale System</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sales/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            New Sale
          </Link>
        </div>
      </div>

      {/* Stats */}
      <SalesStats stats={stats} loading={loading} />

      {/* Search Bar - Properly sized with small icon */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice or customer..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Sales Table or Empty State */}
      {sales.length === 0 && !loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <PlusIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No sales yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Create your first sale to start tracking revenue and payments.
            </p>
            <Link
              href="/sales/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Create First Sale
            </Link>
          </div>
        </div>
      ) : (
        <SalesTable sales={sales} loading={loading} />
      )}
    </div>
  );
}
