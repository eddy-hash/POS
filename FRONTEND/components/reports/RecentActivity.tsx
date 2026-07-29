'use client';

interface RecentActivityProps {
  title: string;
  items: any[];
  formatCurrency: (amount: number) => string;
  type: 'sales' | 'expenses';
}

export default function RecentActivity({ title, items, formatCurrency, type }: RecentActivityProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-3 sm:mb-4">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No recent {type}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-3 sm:mb-4">{title}</h3>
      <div className="space-y-2 sm:space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate">
                {type === 'sales' ? item.saleNumber : item.category}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {type === 'sales' ? (item.customerName || 'Walk-in') : item.description}
              </p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white ml-2">
              {formatCurrency(type === 'sales' ? (item.netAmount || item.totalAmount || 0) : item.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
