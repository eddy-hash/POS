'use client';

import Image from 'next/image';

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: '/payment-methods/m-pesa.png' },
  { id: 'airtel_money', name: 'Airtel Money', icon: '/payment-methods/airtel-money.png' },
  { id: 'yas_mixx', name: 'Yas Mixx', icon: '/payment-methods/yas-mixx.png' },
  { id: 'crdb_bank', name: 'CRDB Bank', icon: '/payment-methods/crdb-bank.png' },
];

interface PaymentSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function PaymentSelector({ paymentMethod, setPaymentMethod }: PaymentSelectorProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Payment Method
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200
              ${
                paymentMethod === method.id
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600/20 dark:ring-blue-400/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }
            `}
          >
            <div className="relative w-12 h-12">
              <Image
                src={method.icon}
                alt={method.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {method.name}
            </span>
            {paymentMethod === method.id && (
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
