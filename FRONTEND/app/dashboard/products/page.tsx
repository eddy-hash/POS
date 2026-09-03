'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CubeIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowPathIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/services/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export default function ProductsPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const currency = currencyContext?.currency || 'TZS';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const data = await api.get(`/products?currency=${currency}`, token);
      const productsArray = data?.data || data || [];
      setProducts(productsArray);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [currency]);

  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await api.del(`/products/${id}`, token);
      showSuccessToast('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete product');
    }
  };

  const displayPrice = (product: any) => {
    if (product.formattedPriceShort) return product.formattedPriceShort;
    if (product.formattedPrice) return product.formattedPrice;
    return formatCurrency(product.price || 0);
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || p.stock_quantity || 0), 0);
  const lowStockItems = products.filter(p => (p.quantity || p.stock_quantity || 0) <= 5).length;
  const activeProducts = products.filter(p => p.isActive !== false).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        <p className="text-sm tracking-wide text-slate-500 dark:text-slate-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

      {/* ─── Compact Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
            <CubeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">
              Products
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {totalProducts} total · {totalStock} in stock
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden xs:inline">Refresh</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/products/new')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow-sm active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ─── Description ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/30 px-4 py-2">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Manage your product catalog and inventory.
        </p>
      </div>

      {/* ─── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <CubeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Products</p>
              <p className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Stock</p>
              <p className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
              <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock</p>
              <p className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active</p>
              <p className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{activeProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search ────────────────────────────────────────────────── */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-xs sm:placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* ─── Product Table ────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-700/50">
            <CubeIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
          </div>
          <p className="font-display font-semibold text-base sm:text-lg mt-4 text-slate-900 dark:text-white">
            {search ? 'No matching products found' : 'No products yet'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto px-4">
            {search ? 'Try adjusting your search terms.' : 'Start building your product catalog.'}
          </p>
          {!search && (
            <button
              onClick={() => router.push('/dashboard/products/new')}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow-sm active:scale-95 w-full sm:w-auto justify-center"
            >
              <PlusIcon className="h-4 w-4" />
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <div className="col-span-1 hidden sm:block text-center">#</div>
            <div className="col-span-2 sm:col-span-2">SKU</div>
            <div className="col-span-3 sm:col-span-3">Product</div>
            <div className="col-span-2 text-right hidden sm:block">Price</div>
            <div className="col-span-2 text-right">Stock</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filteredProducts.map((product, i) => (
            <div
              key={product.id}
              className={`grid grid-cols-12 gap-3 items-center px-4 py-3.5 ${i !== filteredProducts.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150`}
            >
              <div className="col-span-1 hidden sm:block text-center">
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-2 min-w-0">
                <p className="font-mono text-xs truncate text-slate-500 dark:text-slate-400">{product.sku}</p>
              </div>
              <div className="col-span-3 sm:col-span-3 min-w-0">
                <p className="font-serif text-sm font-medium truncate text-slate-900 dark:text-white">{product.name}</p>
              </div>
              <div className="col-span-2 text-right hidden sm:block">
                <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {displayPrice(product)}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className={`font-mono text-sm font-semibold whitespace-nowrap ${(product.quantity || product.stock_quantity || 0) <= 5 ? 'text-red-600 dark:text-red-400' : (product.quantity || product.stock_quantity || 0) <= 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {product.quantity || product.stock_quantity || 0}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                  className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
          </div>
        </div>
      )}
    </div>
  );
}