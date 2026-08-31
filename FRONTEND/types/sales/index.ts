export interface SaleItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  invoice_number: string;
  customer_phone: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items: SaleItem[];
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface SaleFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}
