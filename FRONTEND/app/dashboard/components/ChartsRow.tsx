'use client';
import { motion } from 'framer-motion';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import ExpensesTrendChart from '@/components/dashboard/ExpensesTrendChart';

interface ChartsRowProps {
  salesTrend: any[];
  expenseTrend: any[];
}

export function ChartsRow({ salesTrend, expenseTrend }: ChartsRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Sales Trend</h3>
        <div className="h-[200px] sm:h-[250px]">
          <SalesTrendChart data={salesTrend} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Expenses Trend</h3>
        <div className="h-[200px] sm:h-[250px]">
          <ExpensesTrendChart data={expenseTrend} />
        </div>
      </motion.div>
    </div>
  );
}
