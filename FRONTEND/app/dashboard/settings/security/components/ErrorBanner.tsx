'use client';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  if (!message) return null;

  return (
    <div className="mb-5 flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 border border-red-200 dark:border-red-800/50 rounded-xl shadow-sm animate-fadeIn max-w-2xl">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
        <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Something went wrong</p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-0.5 break-words">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1.5 rounded-lg text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        aria-label="Dismiss"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
