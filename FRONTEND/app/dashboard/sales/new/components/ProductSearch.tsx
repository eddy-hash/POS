'use client';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';

interface ProductSearchProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductSearch({ products, onAddProduct }: ProductSearchProps) {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const productList = Array.isArray(products) ? products : [];
  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Products
        </h3>
        <button
          onClick={() => setShow(!show)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          <PlusIcon className="h-4 w-4 inline mr-1" /> Add Product
        </button>
      </div>

      {show && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <div className="mt-2 max-h-40 overflow-y-auto">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => { onAddProduct(product); setShow(false); setSearchTerm(''); }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition flex justify-between items-center text-slate-900 dark:text-white"
              >
                <span>{product.name}</span>
                <span className="text-sm font-semibold">
                  TZS {product.price}
                </span>
              </button>
            ))}
            {filtered.length === 0 && searchTerm && (
              <p className="text-sm text-slate-500 dark:text-slate-400 px-3 py-2">No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
