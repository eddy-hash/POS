export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface PurchaseItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface PurchaseFormData {
  supplier: string;
  notes: string;
  items: PurchaseItem[];
  totalAmount: number;
}
