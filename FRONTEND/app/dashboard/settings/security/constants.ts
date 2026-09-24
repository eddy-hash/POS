export const PASSWORD_RULES = [
  'At least 8 characters long',
  'Cannot be the same as your current password',
  'Cannot be one of your last 5 passwords',
  'Use a mix of letters, numbers, and symbols',
];

export const STRENGTH_LABELS: Record<number, { text: string; color: string }> = {
  0: { text: '', color: '' },
  1: { text: 'Weak password', color: 'text-red-500 dark:text-red-400' },
  2: { text: 'Weak password', color: 'text-red-500 dark:text-red-400' },
  3: { text: 'Fair password', color: 'text-amber-600 dark:text-amber-400' },
  4: { text: 'Good password', color: 'text-amber-600 dark:text-amber-400' },
  5: { text: 'Strong password', color: 'text-emerald-600 dark:text-emerald-400' },
  6: { text: 'Strong password', color: 'text-emerald-600 dark:text-emerald-400' },
};
