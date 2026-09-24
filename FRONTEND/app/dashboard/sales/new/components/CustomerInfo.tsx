'use client';
import { UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface CustomerInfoProps {
  customerName: string;
  setCustomerName: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
}

export function CustomerInfo({
  customerName,
  setCustomerName,
  paymentMethod,
  setPaymentMethod,
}: CustomerInfoProps) {
  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
        Customer Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <UserIcon className="h-4 w-4 inline mr-1" /> Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            placeholder="Walk-in customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <CreditCardIcon className="h-4 w-4 inline mr-1" /> Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Money</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
      </div>
    </div>
  );
}
