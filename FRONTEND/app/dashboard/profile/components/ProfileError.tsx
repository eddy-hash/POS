interface ProfileErrorProps {
  error: string;
  onRetry: () => void;
}

export function ProfileError({ error, onRetry }: ProfileErrorProps) {
  return (
    <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
      <span className="text-4xl block mb-3">⚠️</span>
      <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
      >
        Retry
      </button>
    </div>
  );
}
