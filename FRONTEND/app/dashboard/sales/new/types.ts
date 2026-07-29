export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface SaleItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface SaleFormData {
  customerName: string;
  paymentMethod: string;
  discountAmount: number;
  taxAmount: number;
  notes: string;
  items: SaleItem[];
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SaleTotals {
  subtotal: number;
  tax: number;
  netAmount: number;
}
