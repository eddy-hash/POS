'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number;
}

interface ProductSearchProps {
  products: Product[];
  onAddProduct: (productId: string) => void;
  loading?: boolean;
}

export function ProductSearch({ products, onAddProduct, loading }: ProductSearchProps) {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Add Products
      </h2>
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      {loading && <p className="text-sm text-slate-500 mt-2">Loading products...</p>}
      {filteredProducts.length > 0 && !loading && (
        <div className="mt-3 max-h-48 overflow-y-auto space-y-1 border-t border-slate-200 dark:border-slate-700 pt-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                onAddProduct(product.id);
                setSearch('');
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition text-sm"
            >
              <span className="text-slate-700 dark:text-slate-300">{product.name}</span>
              <span className="font-medium text-slate-900 dark:text-white">
                TSh {product.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}
      {filteredProducts.length === 0 && !loading && search && (
        <p className="text-sm text-slate-500 mt-2">No products found</p>
      )}
    </div>
  );
}
