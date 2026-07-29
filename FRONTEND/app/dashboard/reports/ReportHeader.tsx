'use client';
import { ArrowPathIcon, ArrowDownTrayIcon, PrinterIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface ReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

export function ReportHeader({
  dateRange,
  onDateRangeChange,
  onRefresh,
  onExportPDF,
  onPrint,
}: ReportHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
          <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
          Reports & Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Comprehensive business performance insights</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Refresh</span>
        </button>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="hidden xs:inline">PDF</span>
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
        >
          <PrinterIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Print</span>
        </button>
      </div>
    </div>
  );
}
