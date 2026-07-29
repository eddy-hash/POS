'use client';
import ChartCard from '@/components/reports/ChartCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface ChartsGridProps {
  stats: {
    salesTrend: { date: string; amount: number }[];
    expenseTrend: { date: string; amount: number }[];
    topProducts: { name: string; sales: number }[];
  };
  formatCurrency: (value: number) => string;
}

export function ChartsGrid({ stats, formatCurrency }: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      <ChartCard title="Revenue vs Expenses" subtitle="Daily trend">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stats.salesTrend.map((s, i) => ({
              ...s,
              expenses: stats.expenseTrend[i]?.amount || 0,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="date" className="text-[10px] sm:text-xs" tick={{ fontSize: 10 }} />
            <YAxis className="text-[10px] sm:text-xs" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(30 41 59)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Products" subtitle="By sales volume">
        {stats.topProducts && stats.topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.topProducts}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="sales"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {stats.topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No product data available</p>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
