'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/hooks/sales/useProducts';
import { useSaleForm } from '@/hooks/sales/useSaleForm';
import { ProductSearch } from '@/components/sales/forms/ProductSearch';
import { SaleItemsTable } from '@/components/sales/tables/SaleItemsTable';
import { SaleSummary } from '@/components/sales/SaleSummary';
import { SaleNotes } from '@/components/sales/forms/SaleNotes';
import { CustomerLookup } from '@/components/sales/forms/CustomerLookup';
import { PaymentSelector } from '@/components/sales/forms/PaymentSelector';

export default function NewSalePage() {
  const router = useRouter();
  const { products, loading: productsLoading } = useProducts();
  const {
    saleItems,
    customerPhone,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    setCustomerPhone,
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Sale</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Create a new sale transaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Phone Only */}
            <CustomerLookup 
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
            />

            {/* Payment Method */}
            <PaymentSelector 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* Product Search */}
            <ProductSearch 
              products={products} 
              onAddProduct={addProduct} 
              loading={productsLoading} 
            />

            {/* Sale Items */}
            <SaleItemsTable
              items={saleItems}
              onQuantityChange={updateQuantity}
              onRemoveItem={removeItem}
            />

            {/* Notes */}
            <SaleNotes notes={notes} setNotes={setNotes} />
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
