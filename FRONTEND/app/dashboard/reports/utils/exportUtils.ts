import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COMPANY_NAME = 'Smart POS';
const COMPANY_TAGLINE = 'Point of Sale System';

export interface ExportPDFOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export async function exportPDF(
  dateRange: string,
  currency: string = 'TZS',
  options: ExportPDFOptions = {},
) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    showErrorToast('Session expired', 'Please log in again.');
    options.onError?.('Session expired');
    return;
  }

  try {
    //  Relative URL – goes through Nginx (port 80)
    const res = await fetch(`/api/reports/stats?range=${dateRange}&currency=${currency}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403 || res.status === 401) return;   // silently skip
    if (!res.ok) throw new Error('Failed to fetch report data');
    const result = await res.json();
    const stats = result.data || result;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;


    doc.setFillColor(30, 58, 95);     
    doc.rect(0, 0, pageWidth, 52, 'F');

    // --- Accent line (gold/amber) ---
    doc.setFillColor(212, 175, 55);     
    doc.rect(0, 52, pageWidth, 3, 'F');

    // --- Company name (left) ---
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_NAME, margin, 28);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(200, 200, 200);
    doc.text(COMPANY_TAGLINE, margin, 36);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Business Report', pageWidth - margin, 28, { align: 'right' });

    // --- Report subtitle (right side) ---
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('Performance Summary', pageWidth - margin, 36, { align: 'right' });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - margin - 60, 42, pageWidth - margin, 42);

    y = 66;
    doc.setTextColor(80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    // Period – left aligned
    doc.text(`Period: ${dateRange.toUpperCase()}`, margin, y);

    // Currency – center aligned
    const currencyText = `Currency: ${stats.displayCurrency || currency}`;
    doc.text(currencyText, pageWidth / 2, y, { align: 'center' });

    // Generated – right aligned
    const genText = `Generated: ${new Date().toLocaleString()}`;
    doc.text(genText, pageWidth - margin, y, { align: 'right' });

    y += 6;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30);
    doc.text('Summary', margin, y);
    y += 6;

    const summaryData = [
      ['Total Sales', stats.totalSales ?? 0],
      ['Total Revenue', stats.formatted?.totalRevenue || `${stats.displayCurrency || currency} ${stats.totalRevenue?.toLocaleString() || 0}`],
      ['Total Expenses', stats.formatted?.totalExpenses || `${stats.displayCurrency || currency} ${stats.totalExpenses?.toLocaleString() || 0}`],
      [
        (stats.profit ?? 0) >= 0 ? 'Net Profit' : 'Net Loss',
        stats.formatted?.profit
          || `${stats.displayCurrency || currency} ${Math.abs(stats.profit ?? 0).toLocaleString()}`,
      ],
      ['Active Products', stats.totalProducts ?? 0],
      ['Total Purchases', stats.totalPurchases ?? 0],
    ];

    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 'auto', halign: 'right' },
      },
      margin: { left: margin, right: margin },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [245, 245, 245];
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    if (stats.topProducts && stats.topProducts.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30);
      doc.text('Top Products', margin, y);
      y += 6;

      const productData = stats.topProducts.map((p: any) => [
        p.name || 'Unknown',
        `${stats.displayCurrency || currency} ${Number(p.sales || 0).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Product', 'Total Sales']],
        body: productData,
        theme: 'grid',
        headStyles: {
          fillColor: [46, 204, 113],
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto', halign: 'right' },
        },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.row.index % 2 === 0) {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (stats.recentSales && stats.recentSales.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30);
      doc.text('Recent Sales', margin, y);
      y += 6;

      const salesData = stats.recentSales.map((s: any) => [
        new Date(s.saleDate).toLocaleDateString(),
        s.customerName || 'N/A',
        `${stats.displayCurrency || currency} ${Number(s.netAmount || 0).toLocaleString()}`,
        s.status || 'Completed',
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Date', 'Customer', 'Amount', 'Status']],
        body: salesData,
        theme: 'grid',
        headStyles: {
          fillColor: [231, 76, 60],
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 30, halign: 'center' },
        },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.row.index % 2 === 0) {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        },
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (stats.lowStockItems && stats.lowStockItems.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30);
      doc.text('Low Stock Items', margin, y);
      y += 6;

      const stockData = stats.lowStockItems.slice(0, 10).map((item: any) => [
        item.name || 'Unknown',
        item.sku || 'N/A',
        item.quantity ?? 0,
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Product', 'SKU', 'Quantity']],
        body: stockData,
        theme: 'grid',
        headStyles: {
          fillColor: [243, 156, 18],
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: { fontSize: 9 },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.row.index % 2 === 0) {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        },
      });
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} of ${pageCount}  •  ${new Date().toLocaleString()}`,
        margin,
        doc.internal.pageSize.getHeight() - 8
      );
    }

    const displayCurrency = stats.displayCurrency || currency || 'TZS';
    doc.save(`report_${dateRange}_${displayCurrency}_${new Date().toISOString().split('T')[0]}.pdf`);
    showSuccessToast('PDF exported successfully');
    options.onSuccess?.();
    options.onSuccess?.();
  } catch (error) {
    console.error('PDF export error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate PDF';
    showErrorToast(message, 'Please try again later.');
    options.onError?.(message);
  }
}

export function handlePrint() {
  window.print();
}