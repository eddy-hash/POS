'use client';
import { useState } from 'react';
import { Product } from '../types';

interface ProductSearchProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductSearch({ products, onAddProduct }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => { onAddProduct(product); setSearchTerm(''); }}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex justify-between items-center text-slate-900 dark:text-white"
              >
                <span>{product.name}</span>
                <span className="text-sm font-semibold">TZS {product.price}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">No products found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
