'use client';
import { useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { DashboardHeader } from './components/DashboardHeader';
import { StatCards } from './components/StatCards';
import { ChartsRow } from './components/ChartsRow';
import { BottomCharts } from './components/BottomCharts';
import { useDashboard } from './hooks/useDashboard';
import { showSuccessToast } from '@/lib/toast';

const STEPS = ['Overview', 'Trends', 'Insights'];

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { loading, stats, currency, symbols, rates, loadDashboard } = useDashboard();

  const isLastStep = currentStep === STEPS.length - 1;

  const nextStep = () => {
    if (isLastStep) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // ─── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      </motion.div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm">Failed to load dashboard</p>
        <button
          onClick={loadDashboard}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const profit = stats.profit || 0;
  const totalProfit = profit > 0 ? profit : 0;
  const loss = profit < 0 ? Math.abs(profit) : 0;

  const f = stats.formatted || {};
  const useAbbreviated = currency === 'TZS';
  const displayRevenue = useAbbreviated
    ? f.totalRevenue || 'TSh 0'
    : stats.formattedFull?.totalRevenue || f.totalRevenue || '';
  const displayExpenses = useAbbreviated
    ? f.totalExpenses || 'TSh 0'
    : stats.formattedFull?.totalExpenses || f.totalExpenses || '';
  const displayProfit = useAbbreviated
    ? f.profit || 'TSh 0'
    : stats.formattedFull?.profit || f.profit || '';

  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];
  const salesTrend = stats.salesTrend || [];
  const expenseTrend = stats.expenseTrend || [];

  // ─── Step Content ──────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <StatCards
              stats={stats}
              displayRevenue={displayRevenue}
              displayExpenses={displayExpenses}
              displayProfit={displayProfit}
              profit={profit}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <ChartsRow salesTrend={salesTrend} expenseTrend={expenseTrend} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <BottomCharts topProducts={topProducts} profit={totalProfit} loss={loss} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // ─── Main Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      
      {/* ─── Header (always visible) ───────────────────────────────── */}
      <DashboardHeader
        currency={currency}
        symbols={symbols}
        rates={rates}
        onRefresh={async () => { await loadDashboard(); showSuccessToast('Dashboard refreshed'); }}
        loading={loading}
      />

      {/* ─── Progress Bar ───────────────────────────────────────────── */}
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

      {/* ─── Step Indicator ─────────────────────────────────────────── */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
      </p>

      {/* ─── Step Content ───────────────────────────────────────────── */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* ─── Navigation Buttons ────────────────────────────────────── */}
      <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={isLastStep}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLastStep ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Done
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
  );
}