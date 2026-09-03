'use client';
export const dynamic = "force-dynamic";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useExpenseForm } from './hooks/useExpenseForm';
import { ExpenseBasicInfo } from './components/ExpenseBasicInfo';
import { ExpenseAmount } from './components/ExpenseAmount';
import { ExpenseReview } from './components/ExpenseReview';
import { ExpenseNavigation } from './components/ExpenseNavigation';

export default function NewExpensePage() {
  const router = useRouter();
  const {
    form,
    setForm,
    loading,
    error,
    currentStep,
    steps,
    isLastStep,
    canProceed,
    nextStep,
    prevStep,
    handleSubmit,
  } = useExpenseForm();

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <ExpenseBasicInfo form={form} setForm={setForm} />;
      case 1:
        return <ExpenseAmount form={form} setForm={setForm} />;
      case 2:
        return <ExpenseReview form={form} error={error} />;
      default:
        return null;
    }
  }, [currentStep, form, error]);

  return (
    <div className="max-w-3xl mx-auto dark:bg-slate-900 dark:text-white p-4 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Expense</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all ${
              idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>

        <ExpenseNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed()}
          loading={loading}
          isLastStep={isLastStep}
          onBack={prevStep}
          onNext={nextStep}
        />
      </form>
    </div>
  );
}
