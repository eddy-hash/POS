import { PencilIcon } from '@heroicons/react/24/outline';

interface ProfileAvatarProps {
  name: string;
  email: string;
  isActive: boolean;
}

export function ProfileAvatar({ name, email, isActive }: ProfileAvatarProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-800">
          <span className="text-3xl sm:text-4xl text-white font-bold">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
            <PencilIcon className="h-3 w-3 text-slate-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white truncate">
            {name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {email}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isActive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
