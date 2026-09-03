interface Props {
  form: any;
  setForm: (form: any) => void;
}

export function ExpenseAmount({ form, setForm }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Amount (TZS) *
        </label>
        <input
          key="expense-amount"
          type="number"
          required
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="1000"
        />
        {form.amount && parseFloat(form.amount) > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Amount: TZS {parseFloat(form.amount).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
