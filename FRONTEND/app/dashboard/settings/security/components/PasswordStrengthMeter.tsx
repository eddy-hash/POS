'use client';
import { STRENGTH_LABELS } from '../constants';

export function PasswordStrengthMeter({ score }: { score: number }) {
  if (score <= 0) return null;

  const meta = STRENGTH_LABELS[score] || { text: '', color: '' };
  const barColor =
    score <= 2 ? 'bg-red-500' : score <= 4 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              level <= score ? barColor : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1.5 font-medium ${meta.color}`}>{meta.text}</p>
    </div>
  );
}
