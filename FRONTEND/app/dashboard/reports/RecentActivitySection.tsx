'use client';
import RecentActivity from '@/components/reports/RecentActivity';

interface RecentActivitySectionProps {
  title: string;
  items: any[];
  formatCurrency: (value: number) => string;
  type: 'sales' | 'expenses';
}

export default function RecentActivitySection({
  title,
  items,
  formatCurrency,
  type,
}: RecentActivitySectionProps) {
  return (
    <RecentActivity
      title={title}
      items={items || []}
      formatCurrency={formatCurrency}
      type={type}
    />
  );
}
