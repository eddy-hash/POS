'use client';

import { useState, useEffect } from 'react';

interface Sale {
  id: string;
  invoice_number: string;
  customer_phone: string;
  payment_method: string;
  total: number;
  status: string;
  created_at: string;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export function useSales(filter?: { search?: string }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/sales');
        const data = await response.json();
        setSales(data.sales || []);
        setStats(data.stats || {
          totalSales: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          averageOrderValue: 0,
        });
      } catch (error) {
        console.error('Failed to fetch sales:', error);
        // Set empty state
        setSales([]);
        setStats({
          totalSales: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          averageOrderValue: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [filter?.search]);

  return { sales, loading, stats };
}
