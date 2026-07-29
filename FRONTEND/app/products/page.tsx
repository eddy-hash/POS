
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  Search,
  FunnelIcon,
  PackageIcon,
  TagIcon,
  AlertTriangleIcon,
  XCircleIcon,
  XIcon
} from 'lucide-react';
import { getProducts, getCategories, deleteProduct, Product, Category } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err: any) {
      console.error('Error loading products:', err);
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
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const handleRetry = () => loadData();
  const handleClearFilters = () => { setSearch(''); setSelectedCategory(''); };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: PackageIcon, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { label: 'Categories', value: totalCategories, icon: TagIcon, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangleIcon, color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
    { label: 'Out of Stock', value: outOfStock, icon: XCircleIcon, color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  ];

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6 dark:bg-slate-900 dark:text-white min-h-screen p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">Products</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage your product inventory</p>
        </div>
        <Button onClick={() => router.push('/products/new')} className="flex items-center gap-1.5">
          <PlusIcon className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${stat.color.split(' ').slice(0,2).join(' ')}`}>
                  <Icon className={`h-4 w-4 ${stat.color.split(' ').slice(2).join(' ')}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{stat.label}</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-10 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
          />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <FunnelIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm h-10 appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {(search || selectedCategory) && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <button onClick={handleClearFilters} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            <XIcon className="h-3 w-3" /> Clear filters
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={handleRetry} className="px-3 py-1 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 rounded-lg text-xs font-medium">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:!bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{product.name}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">SKU: {product.sku || 'N/A'}</p>
                </div>
                <Badge variant={product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'danger'} className="flex-shrink-0 text-[10px] px-1.5 py-0.5">
                  {product.quantity > 0 ? product.quantity : '0'}
                </Badge>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">TSh {product.price.toLocaleString()}</p>
                  {product.costPrice && <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">Cost: TSh {product.costPrice.toLocaleString()}</p>}
                </div>
                {product.category && (
                  <span className="flex-shrink-0 text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-lg truncate max-w-[80px]">
                    {product.category.name}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col xs:flex-row gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                <Button variant="outline" size="sm" onClick={() => router.push(`/products/${product.id}/edit`)} className="flex-1 text-xs h-9 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700">
                  <PencilIcon className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)} className="flex-1 text-xs h-9">
                  <TrashIcon className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{search || selectedCategory ? '🔍' : '📦'}</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {search || selectedCategory ? 'No products match your filters' : 'No products yet'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {search || selectedCategory ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first product'}
          </p>
          {(search || selectedCategory) && (
            <button onClick={handleClearFilters} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
              <XIcon className="h-4 w-4" /> Clear all filters
            </button>
          )}
          {!search && !selectedCategory && (
            <Button onClick={() => router.push('/products/new')} className="mt-4">
              <PlusIcon className="h-4 w-4 mr-2" /> Add Your First Product
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
