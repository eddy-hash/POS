'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';
import { getConsistentColor } from '@/lib/colors';

interface ProductData {
  name: string;
  sales: number;
}

interface ProductSalesPieChartProps {
  data: ProductData[];
}

export default function ProductSalesPieChart({ data }: ProductSalesPieChartProps) {
  // ✅ Use useMemo to optimize calculations
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort by sales descending
    const sortedData = [...data].sort((a, b) => b.sales - a.sales);
    
    // Take top 5 products
    const topProducts = sortedData.slice(0, 5);
    
    // Calculate "Others" total
    const othersTotal = sortedData.slice(5).reduce((sum, item) => sum + item.sales, 0);
    
    // Build final data array
    const result = [...topProducts];
    if (othersTotal > 0) {
      result.push({ name: 'Others', sales: othersTotal });
    }
    
    return result;
  }, [data]);

  // ✅ Calculate total for percentage
  const total = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.sales, 0);
  }, [pieData]);

  // ✅ Custom Tooltip with better formatting
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.sales / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 min-w-[140px]">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sales: <span className="font-medium">{data.sales.toLocaleString()} TZS</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // ✅ Custom Legend with better styling
  const renderLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;
    
    return (
      <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 px-2">
        {payload.map((entry: any, index: number) => (
          <li 
            key={`legend-${index}`} 
            className="flex items-center gap-1.5 text-[10px] sm:text-xs transition hover:opacity-70 cursor-pointer"
          >
            <span 
              className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-slate-600 dark:text-slate-400 truncate max-w-[60px] sm:max-w-[100px]">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // ✅ Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-slate-400">No product data available</p>
        </div>
      </div>
    );
  }

  // ✅ Handle single product case
  if (data.length === 1) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{data[0].name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{data[0].sales.toLocaleString()} TZS</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">100% of total sales</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="70%"
          paddingAngle={2}
          dataKey="sales"
          labelLine={false}
          animationDuration={500}
          animationBegin={0}
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${entry.name}-${index}`} 
              fill={getConsistentColor(entry.name, index)} 
              stroke="#fff" 
              strokeWidth={2}
              className="transition-opacity hover:opacity-80 cursor-pointer"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          content={renderLegend} 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ paddingTop: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
