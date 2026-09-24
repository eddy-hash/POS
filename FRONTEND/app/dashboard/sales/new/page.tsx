'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { useProducts } from './hooks/useProducts';
import { useSaleForm } from './hooks/useSaleForm';
import { ProductSearch } from './components/ProductSearch';
import { SaleItemsTable } from './components/SaleItemsTable';
import { Notes } from './components/Notes';
import { CustomerInfo } from './components/CustomerInfo';
import { SaleSummary } from './components/SaleSummary';

const STEPS = ['Products', 'Customer & Payment', 'Review'];

export default function NewSalePage() {
  const router = useRouter();
  const { products } = useProducts();
  const {
    saleItems,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    customerName,
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

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep === STEPS.length - 1) {
      submitSale();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = () => {
    if (currentStep === 0) return saleItems.length > 0;
    if (currentStep === 1) return customerName.trim().length > 0;
    return true;
  };

  // ─── Step content as a RENDER FUNCTION (not a component) ─────────
  // Calling this inline (`{renderStepContent()}`) keeps React from
  // treating it as a new component type on every render — which was
  // causing the whole subtree to unmount/remount on every keystroke,
  // losing input focus.
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <ProductSearch products={products} onAddProduct={addProduct} />
            <SaleItemsTable
              items={saleItems}
              onQuantityChange={updateQuantity}
              onRemoveItem={removeItem}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <CustomerInfo
              customerName={customerName}
              setCustomerName={setCustomerName}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Discount (TZS)
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tax (%)
                </label>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <Notes notes={notes} setNotes={setNotes} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <SaleSummary
              totals={totals}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              loading={loading}
              onSubmit={submitSale}
              hasItems={saleItems.length > 0}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Step Content (with Framer Motion) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[300px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`step-${currentStep}`}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed() || loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  {loading ? 'Submitting...' : 'Complete Sale'}
                  {!loading && <CheckIcon className="h-4 w-4" />}
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
