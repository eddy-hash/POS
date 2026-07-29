'use client';
import ChartCard from '@/components/reports/ChartCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyPerformanceProps {
  monthlyStats: { month: string; revenue: number; expenses: number; profit: number }[];
  formatCurrency: (value: number) => string;
}

export default function MonthlyPerformance({ monthlyStats, formatCurrency }: MonthlyPerformanceProps) {
  return (
    <ChartCard title="Monthly Performance" subtitle="Revenue, expenses & profit">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyStats || []}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" className="text-[10px] sm:text-xs" tick={{ fontSize: 10 }} />
          <YAxis className="text-[10px] sm:text-xs" tick={{ fontSize: 10 }} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
