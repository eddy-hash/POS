export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50 dark:bg-slate-900">
      <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      <p className="text-sm tracking-wide text-slate-500 dark:text-slate-400">Loading...</p>
    </div>
  );
}
