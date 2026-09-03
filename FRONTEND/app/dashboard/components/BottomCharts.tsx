'use client';
import { motion } from 'framer-motion';
import ProductSalesPieChart from '@/components/dashboard/ProductSalesPieChart';
import ProfitLossChart from '@/components/dashboard/ProfitLossChart';

interface BottomChartsProps {
  topProducts: any[];
  profit: number;
  loss: number;
}

export function BottomCharts({ topProducts, profit, loss }: BottomChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Top Products</h3>
        <div className="h-[200px] sm:h-[250px]">
          <ProductSalesPieChart data={topProducts} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-4">Profit vs Loss</h3>
        <div className="h-[200px] sm:h-[250px]">
          <ProfitLossChart profit={profit} loss={loss} />
        </div>
      </motion.div>
    </div>
  );
}
