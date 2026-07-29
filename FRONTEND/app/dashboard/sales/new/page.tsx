'use client';

import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useProducts } from './hooks/useProducts';
import { useSaleForm } from './hooks/useSaleForm';
import { CustomerInfo } from './components/CustomerInfo';
import { ProductSearch } from './components/ProductSearch';
import { SaleItemsTable } from './components/SaleItemsTable';
import { SaleSummary } from './components/SaleSummary';
import { Notes } from './components/Notes';

export default function NewSalePage() {
  const router = useRouter();
  const { products } = useProducts();
  const {
    saleItems,
    customerName,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    setCustomerName,
    setPaymentMethod,
    setDiscountAmount,
    setTaxAmount,
    setNotes,
    addProduct,
    removeItem,
    updateQuantity,
    submitSale,
  } = useSaleForm();

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold mt-5 text-slate-900 dark:text-white">New Sale</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Create a new sale transaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfo
              customerName={customerName}
              setCustomerName={setCustomerName}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <ProductSearch products={products} onAddProduct={addProduct} />
            <SaleItemsTable
              items={saleItems}
              onQuantityChange={updateQuantity}
              onRemoveItem={removeItem}
            />
            <Notes notes={notes} setNotes={setNotes} />
          </div>

          <div className="lg:col-span-1">
            <SaleSummary
              totals={totals}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              loading={loading}
              onSubmit={submitSale}
              hasItems={saleItems.length > 0}
            />
          </div>
        </div>
      </div>
    </>
  );
}
