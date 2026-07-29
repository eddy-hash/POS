'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UsersIcon, PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalSpent?: number;
  createdAt?: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/'); return; }
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) { localStorage.removeItem('access_token'); router.push('/'); return; }
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      const customersArray = Array.isArray(data) ? data : data.data || [];
      setCustomers(customersArray);
    } catch (err: any) {
      setError(err.message);
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this customer?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setCustomers(customers.filter(c => c.id !== id));
      showSuccessToast('Customer deleted');
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="space-y-4 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600 dark:text-blue-400" /> Customers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Manage your customer relationships</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchCustomers} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300">
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
            <button onClick={() => router.push('/dashboard/customers/new')} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm whitespace-nowrap">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate text-sm sm:text-base">{customer.name}</h3>
                  {customer.email && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{customer.email}</p>}
                  {customer.phone && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{customer.phone}</p>}
                </div>
              </div>
              {customer.totalSpent !== undefined && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{formatCurrency(customer.totalSpent)}</p>
                </div>
              )}
              <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => router.push(`/dashboard/customers/${customer.id}/edit`)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg outline-none transition font-medium">
                  <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Edit</span>
                </button>
                <button onClick={() => handleDelete(customer.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg outline-none transition font-medium">
                  <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <UsersIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg font-medium mt-3">No customers found</p>
            <button onClick={() => router.push('/dashboard/customers/new')} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition text-sm">
              Add your first customer
            </button>
          </div>
        )}
      </div>
    </>
  );
}
