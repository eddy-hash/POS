'use client';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryFilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: string | null;
  currentIndex: number;
  totalCategories: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (name: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  currentIndex,
  totalCategories,
  onNext,
  onPrev,
  onSelect,
}: CategoryFilterProps) {
  const categoryNames = ['All', ...categories.map(c => c.name)];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
        disabled={totalCategories === 0}
      >
        <ChevronLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      <div className="flex-1 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap py-1">
          {categoryNames.map((name, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(name)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                (selectedCategory === null && name === 'All') || selectedCategory === name
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
        disabled={totalCategories === 0}
      >
        <ChevronRightIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Progress indicator */}
      {totalCategories > 0 && (
        <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 min-w-[80px] text-center">
          {currentIndex + 1} / {categoryNames.length}
        </div>
      )}
    </div>
  );
}
