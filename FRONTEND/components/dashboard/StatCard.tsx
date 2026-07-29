import { useCurrency } from '@/context/CurrencyContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color: string;
}

export default function StatCard({ title, value, icon, trend, trendLabel, color }: StatCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-sm sm:text-lg lg:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 break-words">{formatCurrency(value)}</p>
          {trend !== undefined && <div className="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap"><span className={`text-[8px] sm:text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span><span className="text-[8px] sm:text-[10px] lg:text-xs text-slate-400 dark:text-slate-500">{trendLabel || 'vs last month'}</span></div>}
        </div>
        <div className={`flex-shrink-0 p-1.5 sm:p-2 lg:p-3 rounded-lg ${color} ml-2 sm:ml-3`}>
          <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white flex items-center justify-center">{icon}</div>
        </div>
      </div>
    </div>
  );
}
