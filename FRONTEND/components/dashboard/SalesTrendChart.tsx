'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '@/context/CurrencyContext';

interface SalesTrendChartProps {
  data: { date: string; amount: number }[];
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  const { formatCurrency } = useCurrency();

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-sm">No sales data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis 
          dataKey="date" 
          className="text-xs" 
          tick={{ fill: 'currentColor' }}
          stroke="currentColor"
        />
        <YAxis 
          className="text-xs" 
          tick={{ fill: 'currentColor' }}
          stroke="currentColor"
          tickFormatter={(value) => formatCurrency(value)}
        />
      <Tooltip
      contentStyle={{
       backgroundColor: 'rgb(30 41 59)',
       border: 'none',
       borderRadius: '8px',
      color: '#fff',
      fontSize: '12px',
  }}
  formatter={(value: any) => value !== undefined && value !== null ? formatCurrency(value) : 'N/A'}
/>
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
