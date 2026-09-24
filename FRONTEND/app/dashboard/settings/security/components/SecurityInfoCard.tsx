'use client';
import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PASSWORD_RULES } from '../constants';

export function SecurityInfoCard() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200/70 dark:border-blue-800/50 rounded-2xl p-5 mb-6 max-w-2xl shadow-sm">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Password Security Rules</p>
          <ul className="text-xs sm:text-sm text-blue-700/80 dark:text-blue-400/90 mt-2 space-y-1.5">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule} className="flex items-center gap-2">
                <CheckCircleIcon className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
