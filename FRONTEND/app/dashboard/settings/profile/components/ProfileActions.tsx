'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ProfileActionsProps {
  saving: boolean;
}

export function ProfileActions({ saving }: ProfileActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 px-6 sm:px-8 pb-6 sm:pb-8">
      <button
        type="submit"
        disabled={saving}
        className="w-full sm:flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl outline-none transition disabled:opacity-50 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
      >
        {saving ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckIcon className="h-4 w-4" />
            Save Changes
          </>
        )}
      </button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/dashboard/settings')}
        className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl outline-none hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
      >
        Cancel
      </motion.button>
    </div>
  );
}
