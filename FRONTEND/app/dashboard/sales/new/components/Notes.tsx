'use client';

interface NotesProps {
  notes: string;
  setNotes: (val: string) => void;
}

export function Notes({ notes, setNotes }: NotesProps) {
  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        placeholder="Add notes about this sale..."
      />
    </div>
  );
}
