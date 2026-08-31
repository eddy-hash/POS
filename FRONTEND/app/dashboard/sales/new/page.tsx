'use client';

import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from './hooks/useProducts';
import { useSaleForm } from './hooks/useSaleForm';
import { ProductSearch } from './components/ProductSearch';
import { SaleItemsTable } from './components/SaleItemsTable';
import { Notes } from './components/Notes';

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: '/payment-methods/m-pesa.png' },
  { id: 'airtel_money', name: 'Airtel Money', icon: '/payment-methods/airtel-money.png' },
  { id: 'yas_mixx', name: 'Yas Mixx', icon: '/payment-methods/yas-mixx.png' },
  { id: 'crdb_bank', name: 'CRDB Bank', icon: '/payment-methods/crdb-bank.png' },
];

export default function NewSalePage() {
  const router = useRouter();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const {
    saleItems,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    setPaymentMethod,
    setDiscountAmount,
    setTaxAmount,
    setNotes,
    addProduct,
    removeItem,
    updateQuantity,
    submitSale,
  } = useSaleForm();

  const handleReview = () => {
    router.push('/sales/review');
  };

  const subtotal = totals?.subtotal ?? 0;
  const total = totals?.total ?? 0;

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Sale</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Create a new sale transaction</p>
            </div>
          </div>

          {productsError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
              <p className="text-sm">Failed to load products: {productsError.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200
                        ${
                          paymentMethod === method.id
                            ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600/20 dark:ring-blue-400/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <div className="relative w-12 h-12 rounded-lg bg-white dark:bg-slate-700 p-1 flex items-center justify-center">
                        <Image
                          src={method.icon}
                          alt={method.name}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {method.name}
                      </span>
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <ProductSearch
                products={products}
                onAddProduct={addProduct}
                loading={productsLoading}
              />

              <SaleItemsTable
                items={saleItems}
                onQuantityChange={updateQuantity}
                onRemoveItem={removeItem}
              />

              <Notes notes={notes} setNotes={setNotes} />

              <div className="flex justify-end">
                <button
                  onClick={handleReview}
                  disabled={saleItems.length === 0}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      saleItems.length > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  Review Sale
                </button>
              </div>
            </div>

            {/* Right column: mini summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-sm sticky top-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sale Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review your sale on the next page.
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Items</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {saleItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      TSh {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      TSh {total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center">
                  Click "Review Sale" to proceed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
