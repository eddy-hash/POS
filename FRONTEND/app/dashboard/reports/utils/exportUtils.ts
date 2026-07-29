import { showErrorToast, showSuccessToast } from '@/lib/toast';

export async function exportPDF(dateRange: string) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    showErrorToast('Please login again');
    return;
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${API_URL}/reports/export/pdf?range=${dateRange}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to generate PDF');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reports_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  showSuccessToast('PDF exported successfully');
}

export function handlePrint() {
  window.print();
}