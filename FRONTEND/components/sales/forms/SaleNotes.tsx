'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface SaleNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export function SaleNotes({ notes, setNotes }: SaleNotesProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Notes
      </h2>
      <div className="relative">
        <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this sale..."
          rows={3}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
