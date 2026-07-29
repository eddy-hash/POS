'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { getProducts, getCategories, deleteProduct, Product, Category } from '@/lib/products';
import { useCurrencySafe } from '@/context/CurrencyContext';

export default function ProductsPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
      console.log('🔍 Products data:', productsData);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showSuccessToast('Product deleted successfully');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      showErrorToast(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) || 
                          product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStock = products.filter(p => {
    const qty = typeof p.quantity === 'number' ? p.quantity : parseInt(p.quantity as any) || 0;
    return qty > 0 && qty <= 10;
  }).length;
  const outOfStock = products.filter(p => {
    const qty = typeof p.quantity === 'number' ? p.quantity : parseInt(p.quantity as any) || 0;
    return qty === 0;
  }).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
    </div>
  );

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="space-y-4 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Manage your product inventory</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/products/new')} 
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg outline-none outline-none hover:bg-blue-700 transition text-sm whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats - Compact on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Total Products</p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{totalProducts}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Categories</p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{totalCategories}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{lowStock}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 md:p-4">
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">Out of Stock</p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-red-600 dark:text-red-400">{outOfStock}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none outline-none hover:bg-slate-50 dark:hover:bg-slate-700 transition bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 sm:py-2 border border-slate-200 dark:border-slate-700 rounded-lg outline-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => { setSelectedCategory(''); setSearch(''); setShowFilters(false); }} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear All
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg outline-none outline-none p-3 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Product Cards - 2 columns on mobile, more on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {filteredProducts.map((product) => {
            const price = typeof product.price === 'number' ? product.price : parseFloat(product.price as any) || 0;
            const costPrice = product.costPrice ? (typeof product.costPrice === 'number' ? product.costPrice : parseFloat(product.costPrice as any) || 0) : null;
            const quantity = typeof product.quantity === 'number' ? product.quantity : parseInt(product.quantity as any) || 0;
            
            return (
              <div 
                key={product.id} 
                className="group bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="p-2.5 sm:p-3 md:p-4">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate text-xs sm:text-sm md:text-base">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">SKU: {product.sku || 'N/A'}</p>
                    </div>
                    <span className={`px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium rounded-full flex-shrink-0 ml-1 ${
                      quantity > 10 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : quantity > 0 
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {quantity > 0 ? quantity : '0'}
                    </span>
                  </div>
                  
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-between gap-1">
                    <div>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(price, true)}
                      </p>
                      {costPrice && (
                        <p className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500">Cost: {formatCurrency(costPrice, true)}</p>
                      )}
                    </div>
                    {product.category && (
                      <span className="text-[9px] sm:text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 sm:px-2.5 py-0.5 rounded-full truncate max-w-[60px] sm:max-w-[80px]">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 sm:mt-3 flex items-center gap-1.5 pt-1.5 sm:pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={() => router.push(`/dashboard/products/${product.id}/edit`)} 
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-[10px] sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg outline-none outline-none transition font-medium"
                    >
                      <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-[10px] sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg outline-none outline-none transition font-medium"
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-4xl sm:text-5xl mb-3">📦</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg font-medium">No products found</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm mt-1">Try adjusting your search or filters</p>
            <button 
              onClick={() => router.push('/dashboard/products/new')} 
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg outline-none outline-none hover:bg-blue-700 transition text-sm"
            >
              <PlusIcon className="h-4 w-4" />Add your first product
            </button>
          </div>
        )}
      </div>
    </>
  );
}
