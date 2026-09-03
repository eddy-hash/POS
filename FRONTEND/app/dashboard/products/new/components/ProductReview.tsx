import { Category } from '@/lib/products';

interface Props {
  form: any;
  categories: Category[];
  error: string;
}

export function ProductReview({ form, categories, error }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Name</span>
          <span className="font-medium text-slate-900 dark:text-white">{form.name || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Category</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {categories.find(c => c.id === parseInt(form.categoryId))?.name || '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Price</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {form.price ? `TZS ${Number(form.price).toLocaleString()}` : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Cost Price</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {form.costPrice ? `TZS ${Number(form.costPrice).toLocaleString()}` : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Quantity</span>
          <span className="font-medium text-slate-900 dark:text-white">{form.quantity || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">SKU</span>
          <span className="font-medium text-slate-900 dark:text-white">{form.sku || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Description</span>
          <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
            {form.description || '—'}
          </span>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
