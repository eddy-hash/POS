import { ProductSearch } from './ProductSearch';
import { PurchaseItemsTable } from './PurchaseItemsTable';

interface ProductsStepProps {
  products: any[];
  items: any[];
  onAddProduct: (product: any) => void;
  onQuantityChange: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
}

export function ProductsStep({
  products,
  items,
  onAddProduct,
  onQuantityChange,
  onRemoveItem,
}: ProductsStepProps) {
  return (
    <div className="space-y-6">
      <ProductSearch products={products} onAddProduct={onAddProduct} />
      <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <PurchaseItemsTable
          items={items}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      </div>
    </div>
  );
}
