'use client';

interface SupplierInfoProps {
  supplier: string;
  setSupplier: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function SupplierInfo({ supplier, setSupplier, notes, setNotes }: SupplierInfoProps) {
  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Supplier name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="e.g. Delivery time, payment terms, special instructions..."
          />
        </div>
      </div>
    </div>
  );
}
