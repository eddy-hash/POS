'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProductsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
        <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} width={80} />
        <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Sales']} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }} />
        <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={28} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
