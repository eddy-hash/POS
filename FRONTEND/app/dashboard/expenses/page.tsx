'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, TrendingUp, Tag, Calendar } from 'lucide-react';
import { PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, ArrowPathIcon, CurrencyDollarIcon, TagIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { useCurrencySafe } from '@/context/CurrencyContext';
import { useExpenses } from '@/lib/hooks/useExpenses';
import StatCard from '@/components/ui/StatCard';

export default function ExpensesPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const [search, setSearch] = useState('');
  const { expenses, loading, error, totalAmount, totalExpenses, categoryCount, averageAmount, fetchExpenses, deleteExpense } = useExpenses({ autoFetch: true });

  const filteredExpenses = expenses.filter((e) => 
    e.category?.toLowerCase().includes(search.toLowerCase()) || 
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => { 
    if (!confirm('Delete this expense?')) return; 
    await deleteExpense(id); 
  };

  if (loading && expenses.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
      <div className="flex justify-center mb-4"><span className="text-5xl">⚠️</span></div>
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading Expenses</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{error}</p>
      <button onClick={fetchExpenses} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition">Retry</button>
    </div>
  );

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="space-y-4 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600 dark:text-blue-400" /> 
              Expenses
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Track your business expenses</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchExpenses} className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300">
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
            <button onClick={() => router.push('/dashboard/expenses/new')} className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm whitespace-nowrap">
              <PlusIcon className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400" />
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Total Expenses</p>
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalExpenses}</p>
          </div>
          <StatCard 
            title="Total Amount" 
            value={totalAmount} 
            icon={<CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />} 
            color="bg-blue-500" 
          />
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 dark:text-purple-400" />
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Categories</p>
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{categoryCount}</p>
          </div>
          <StatCard 
            title="Average Expense" 
            value={averageAmount} 
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />} 
            color="bg-purple-500" 
          />
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Expenses Cards - Mobile Responsive Grid */}
        {filteredExpenses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mt-3">No Expenses Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start tracking your business expenses</p>
            <button onClick={() => router.push('/dashboard/expenses/new')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm">
              Add Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {filteredExpenses.map((e) => {
              const dateToUse = e.expenseDate || e.createdAt || new Date().toISOString();
              return (
                <div 
                  key={e.id} 
                  className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2.5 sm:p-3 md:p-4">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] sm:text-xs font-medium">
                          <TagIcon className="h-3 w-3" />
                          {e.category}
                        </span>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {e.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-1.5 sm:mt-2 flex items-center justify-between">
                      <p className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(e.amount, true)}
                      </p>
                      <p className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500">
                        {new Date(dateToUse).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="mt-2 sm:mt-3 flex items-center gap-1.5 pt-1.5 sm:pt-3 border-t border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => router.push(`/dashboard/expenses/${e.id}/edit`)} 
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-[10px] sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg outline-none transition font-medium"
                      >
                        <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)} 
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-[10px] sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg outline-none transition font-medium"
                      >
                        <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
