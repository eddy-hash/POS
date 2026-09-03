'use client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function ProfileHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
      </button>
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal information
        </p>
      </div>
    </div>
  );
}
