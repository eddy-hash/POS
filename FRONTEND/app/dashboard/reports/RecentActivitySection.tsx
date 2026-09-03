import React from 'react';
import RecentActivity from '@/components/reports/RecentActivity';
import { useCurrencySafe } from '@/context/CurrencyContext';

interface RecentActivitySectionProps {
  title: string;
  items: any[];
  type: 'sales' | 'expenses';
}

export default function RecentActivitySection({
  title,
  items,
  type,
}: RecentActivitySectionProps) {
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((v: number) => v.toFixed(2));

  return (
    <RecentActivity
      title={title}
      items={items || []}
      type={type}
      formatCurrency={formatCurrency}
    />
  );
}