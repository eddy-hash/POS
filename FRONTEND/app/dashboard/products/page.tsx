'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/services/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export default function ProductsPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const currency = currencyContext?.currency || 'TZS';
  const symbols = currencyContext?.symbols || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // ✅ Pass currency to backend
      const data = await api.get(`/products?currency=${currency}`);
      console.log('📦 Products data:', data);
      
      const productsArray = Array.isArray(data) ? data : (data.data || data.products || []);
      console.log('📦 Products array:', productsArray);
      
      setProducts(productsArray);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleCurrencyChange = () => {
      console.log('🔄 Currency changed, refreshing products...');
      fetchProducts();
    };
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  useEffect(() => {
    if (currency) {
      fetchProducts();
    }
  }, [currency]);

  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.del(`/products/${id}`);
      showSuccessToast('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete product');
    }
  };

  const displayPrice = (product: any) => {
    // ✅ Use formattedPriceShort from backend (already in correct currency)
    if (product.formattedPriceShort) {
      return product.formattedPriceShort;
    }
    if (product.formattedPrice) {
      return product.formattedPrice;
    }
    // Fallback
    const symbol = symbols[currency] || currency;
    return `${symbol} ${(product.price || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your product catalog</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Displaying in: {currency} {symbols[currency] || ''}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => router.push('/dashboard/products/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product: any) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                    {displayPrice(product)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 text-right">
                    {product.stock_quantity || product.quantity || 0}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <PencilIcon className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
