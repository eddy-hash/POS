import { CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';

interface ExpensesStatsProps {
  totalExpenses: number;
  totalAmount: number;
  categoryCount: number;
  averageAmount: number;
  formatCurrency: (amount: number) => string;
}

export function ExpensesStats({
  totalExpenses,
  totalAmount,
  categoryCount,
  averageAmount,
  formatCurrency,
}: ExpensesStatsProps) {
  const stats = [
    { label: 'Total', value: totalExpenses, icon: CurrencyDollarIcon, color: 'blue' },
    { label: 'Amount', value: formatCurrency(totalAmount), icon: CurrencyDollarIcon, color: 'green' },
    { label: 'Categories', value: categoryCount, icon: TagIcon, color: 'purple' },
    { label: 'Average', value: formatCurrency(averageAmount), icon: TagIcon, color: 'amber' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
