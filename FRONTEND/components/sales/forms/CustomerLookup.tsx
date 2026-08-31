'use client';

import { PhoneIcon } from '@heroicons/react/24/outline';

interface CustomerLookupProps {
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
}

export function CustomerLookup({ customerPhone, setCustomerPhone }: CustomerLookupProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Customer Phone Number
      </h2>
      <div className="relative">
        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Enter customer phone number (e.g., 0712345678)"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Optional - used to track customer purchase history
      </p>
    </div>
  );
}
