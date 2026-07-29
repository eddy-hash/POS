import { Controller, Get, UseGuards, Request, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import PDFDocument from 'pdfkit';

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────
const COLORS = {
  primary: '#0f172a',
  secondary: '#1e293b',
  text: '#334155',
  muted: '#64748b',
  light: '#94a3b8',
  border: '#e2e8f0',
  background: '#f8fafc',
  cardBg: '#ffffff',
  brand: '#2563eb',
  brandDark: '#1e3a5f',
  brandLight: '#dbeafe',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
  white: '#ffffff',
  gold: '#d4af37',
};

const FONTS = { regular: 'Helvetica', bold: 'Helvetica-Bold' };
const MARGIN = 50;
const BOTTOM_MARGIN = 60;

function formatMoney(n: number): string {
  return `TZS ${Math.round(n || 0).toLocaleString()}`;
}

function formatShortDate(d: any): string {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return 'N/A';
  }
}

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stats')
  async getStats(@Request() req, @Query('range') range: string) {
    const userId = req.user.id;
    const stats = await this.reportsService.getStats(userId, range || 'month');
    return { success: true, data: stats };
  }

  @Get('export/pdf')
  async exportPDF(@Request() req, @Query('range') range: string, @Res() res: Response) {
    try {
      const userId = req.user.id;
      const reportRange = range || 'month';
      const stats = await this.reportsService.getStats(userId, reportRange);
      const user = await this.reportsService.getUserInfo(userId);

      // Use bufferPages: false to avoid auto-pagination
      const doc = new PDFDocument({
        margin: MARGIN,
        size: 'A4',
        bufferPages: false,
        info: {
          Title: 'Business Performance Report',
          Author: user?.name || 'Smart POS',
          Subject: 'Monthly Business Report',
        },
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reports_${reportRange}_${new Date().toISOString().split('T')[0]}.pdf`,
      );
      doc.pipe(res);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const contentWidth = pageWidth - MARGIN * 2;
      const maxY = pageHeight - BOTTOM_MARGIN;

      // ─── Helper: draw a styled table ──────────────────────────────────
      const drawTable = (
        x: number,
        y: number,
        colWidths: number[],
        headers: string[],
        rows: string[][],
        opts?: { align?: ('left' | 'right' | 'center')[]; highlightFirst?: boolean },
      ): number => {
        const rowH = 22;
        const headH = 26;
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);

        // Header
        doc.roundedRect(x, y, tableWidth, headH, 4).fill(COLORS.brand);
        doc.fontSize(9).font(FONTS.bold).fillColor(COLORS.white);
        let xPos = x;
        headers.forEach((h, i) => {
          doc.text(h, xPos + 10, y + 7, {
            width: colWidths[i] - 18,
            align: opts?.align?.[i] || 'left',
          });
          xPos += colWidths[i];
        });

        let rowY = y + headH;
        rows.forEach((row, rIdx) => {
          const bg = rIdx % 2 === 0 ? COLORS.white : COLORS.background;
          doc.rect(x, rowY, tableWidth, rowH).fill(bg);
          doc.strokeColor(COLORS.border).lineWidth(0.5).rect(x, rowY, tableWidth, rowH).stroke();

          xPos = x;
          row.forEach((val, cIdx) => {
            const isBold = opts?.highlightFirst && cIdx === 0;
            doc
              .fontSize(8.5)
              .font(isBold ? FONTS.bold : FONTS.regular)
              .fillColor(isBold ? COLORS.brand : COLORS.text)
              .text(val, xPos + 10, rowY + 5, {
                width: colWidths[cIdx] - 18,
                align: opts?.align?.[cIdx] || 'left',
              });
            xPos += colWidths[cIdx];
          });
          rowY += rowH;
        });

        return rowY;
      };

      // ─── PAGE 1: COVER ──────────────────────────────────────────────────
      // Brand bar
      doc.rect(0, 0, pageWidth, 8).fill(COLORS.brand);

      doc.fontSize(32).font(FONTS.bold).fillColor(COLORS.primary).text('Smart POS', MARGIN, 60);
      doc.fontSize(12).font(FONTS.regular).fillColor(COLORS.muted).text('Point of Sale System', MARGIN, 96);
      doc.fontSize(24).font(FONTS.bold).fillColor(COLORS.brand).text('Business Performance Report', MARGIN, 160);
      doc.fontSize(11).font(FONTS.regular).fillColor(COLORS.muted);
      doc.text(`Report Range: ${reportRange.toUpperCase()}`, MARGIN, 210);
      doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, 235);

      const cardY = 290;
      doc.roundedRect(MARGIN, cardY, contentWidth, 80, 8).fill(COLORS.background).stroke(COLORS.border);
      doc.fontSize(9).font(FONTS.bold).fillColor(COLORS.muted).text('PREPARED FOR', MARGIN + 20, cardY + 14);
      doc.fontSize(14).font(FONTS.bold).fillColor(COLORS.primary).text(user?.name || 'N/A', MARGIN + 20, cardY + 32);
      doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.muted).text(user?.email || 'N/A', MARGIN + 20, cardY + 54);

      // ─── PAGE 2: KEY METRICS ───────────────────────────────────────────
      doc.addPage();
      let yPos = MARGIN + 20;

      doc.fontSize(20).font(FONTS.bold).fillColor(COLORS.primary).text('Executive Summary', MARGIN, yPos);
      yPos += 34;
      doc.strokeColor(COLORS.brand).lineWidth(2).moveTo(MARGIN, yPos).lineTo(MARGIN + 80, yPos).stroke();
      yPos += 20;
      doc.fontSize(11).font(FONTS.regular).fillColor(COLORS.muted)
        .text(`Key performance indicators for ${reportRange.toUpperCase()} period`, MARGIN, yPos);
      yPos += 28;

      const profit = (stats.totalRevenue || 0) - (stats.totalExpenses || 0);
      const metrics = [
        { label: 'Total Sales', value: (stats.totalSales ?? 0).toString(), color: COLORS.brand },
        { label: 'Total Revenue', value: formatMoney(stats.totalRevenue), color: COLORS.success },
        { label: 'Total Expenses', value: formatMoney(stats.totalExpenses), color: COLORS.danger },
        { label: 'Net Profit', value: formatMoney(profit), color: profit >= 0 ? COLORS.success : COLORS.danger },
        { label: 'Total Customers', value: (stats.totalCustomers ?? 0).toString(), color: COLORS.warning },
        { label: 'Total Products', value: (stats.totalProducts ?? 0).toString(), color: '#7c3aed' },
      ];

      const cardW = (contentWidth - 24) / 3;
      const cardH = 72;
      const gap = 12;

      metrics.forEach((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = MARGIN + col * (cardW + gap);
        const y = yPos + row * (cardH + gap);

        doc.roundedRect(x, y, cardW, cardH, 8).fill(COLORS.white).stroke(COLORS.border);
        doc.roundedRect(x, y, 5, cardH, 3).fill(m.color);
        doc.fontSize(7.5).font(FONTS.bold).fillColor(COLORS.muted)
          .text(m.label.toUpperCase(), x + 16, y + 12, { width: cardW - 30 });
        doc.fontSize(16).font(FONTS.bold).fillColor(m.color)
          .text(m.value, x + 16, y + 30, { width: cardW - 30 });
      });

      yPos += Math.ceil(metrics.length / 3) * (cardH + gap) + 16;

      const marginPct = stats.totalRevenue ? ((profit / stats.totalRevenue) * 100).toFixed(1) : '0.0';
      doc.roundedRect(MARGIN, yPos, contentWidth, 38, 8).fill(COLORS.brandLight);
      doc.fontSize(9.5).font(FONTS.regular).fillColor(COLORS.brandDark)
        .text(`Net profit margin: ${marginPct}%  ·  ${profit >= 0 ? '✅ Operating profitably' : '⚠️ Operating at a loss'}`, MARGIN + 16, yPos + 12);

      // ─── PAGE 3: MONTHLY PERFORMANCE ───────────────────────────────────
      doc.addPage();
      yPos = MARGIN + 20;

      doc.fontSize(20).font(FONTS.bold).fillColor(COLORS.primary).text('Monthly Performance', MARGIN, yPos);
      yPos += 34;
      doc.strokeColor(COLORS.brand).lineWidth(2).moveTo(MARGIN, yPos).lineTo(MARGIN + 80, yPos).stroke();
      yPos += 20;

      if (stats.monthlyStats && stats.monthlyStats.length > 0) {
        const colWidths = [90, 130, 130, 130];
        const rows = stats.monthlyStats.map((r: any) => [
          r.month,
          r.revenue.toLocaleString(),
          r.expenses.toLocaleString(),
          r.profit.toLocaleString(),
        ]);
        yPos = drawTable(
          MARGIN,
          yPos,
          colWidths,
          ['Month', 'Revenue (TZS)', 'Expenses (TZS)', 'Profit (TZS)'],
          rows,
          { align: ['left', 'right', 'right', 'right'], highlightFirst: true },
        );
        yPos += 26;

        // Bar chart
        const chartH = 130;
        const chartY = yPos;
        const maxRevenue = Math.max(...stats.monthlyStats.map((r: any) => r.revenue), 1);
        const barGap = 16;
        const barW = Math.min(48, (contentWidth - barGap * (stats.monthlyStats.length - 1)) / stats.monthlyStats.length);

        doc.strokeColor(COLORS.border).lineWidth(1)
          .moveTo(MARGIN, chartY + chartH).lineTo(MARGIN + contentWidth, chartY + chartH).stroke();

        stats.monthlyStats.forEach((r: any, i: number) => {
          const barHeight = (r.revenue / maxRevenue) * (chartH - 20);
          const x = MARGIN + i * (barW + barGap);
          const y = chartY + chartH - barHeight;
          doc.roundedRect(x, y, barW, barHeight, 3).fill(COLORS.brand);
          doc.fontSize(7.5).font(FONTS.regular).fillColor(COLORS.muted)
            .text(r.month.slice(0, 3), x, chartY + chartH + 6, { width: barW, align: 'center' });
        });
        // No need to update yPos; we're done with this page
      } else {
        doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.muted)
          .text('No monthly data available for this period.', MARGIN, yPos);
      }

      // ─── PAGE 4: TOP PRODUCTS ──────────────────────────────────────────
      doc.addPage();
      yPos = MARGIN + 20;

      doc.fontSize(20).font(FONTS.bold).fillColor(COLORS.primary).text('Top Products', MARGIN, yPos);
      yPos += 34;
      doc.strokeColor(COLORS.brand).lineWidth(2).moveTo(MARGIN, yPos).lineTo(MARGIN + 80, yPos).stroke();
      yPos += 20;

      if (stats.topProducts && stats.topProducts.length > 0) {
        const maxSales = stats.topProducts[0]?.sales || 1;

        doc.fontSize(8.5).font(FONTS.bold).fillColor(COLORS.muted);
        doc.text('RANK', MARGIN, yPos);
        doc.text('PRODUCT', MARGIN + 60, yPos);
        doc.text('SALES (TZS)', MARGIN + 280, yPos);
        doc.text('PERFORMANCE', MARGIN + 400, yPos);
        yPos += 16;
        doc.strokeColor(COLORS.border).lineWidth(1).moveTo(MARGIN, yPos).lineTo(pageWidth - MARGIN, yPos).stroke();
        yPos += 12;

        stats.topProducts.forEach((product: any, index: number) => {
          const percentage = (product.sales / maxSales) * 100;
          const rankColor = index === 0 ? COLORS.gold : index === 1 ? COLORS.muted : index === 2 ? '#b45309' : COLORS.text;

          doc.fontSize(10).font(FONTS.bold).fillColor(rankColor).text(`#${index + 1}`, MARGIN, yPos);
          doc.fontSize(9.5).font(FONTS.regular).fillColor(COLORS.text)
            .text(product.name, MARGIN + 60, yPos, { width: 210 });
          doc.fontSize(9.5).font(FONTS.bold).fillColor(COLORS.brand)
            .text(product.sales.toLocaleString(), MARGIN + 280, yPos, { width: 110 });

          const barX = MARGIN + 400;
          const barWidth = 100;
          doc.roundedRect(barX, yPos + 2, barWidth, 9, 4).fill(COLORS.background);
          doc.roundedRect(barX, yPos + 2, Math.max(4, (percentage / 100) * barWidth), 9, 4)
            .fill(percentage > 70 ? COLORS.success : percentage > 40 ? COLORS.warning : COLORS.danger);
          doc.fontSize(7.5).font(FONTS.regular).fillColor(COLORS.muted)
            .text(`${percentage.toFixed(0)}%`, barX + barWidth + 6, yPos + 1);

          yPos += 30;
        });
      } else {
        doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.muted)
          .text('No product data available for this period.', MARGIN, yPos);
      }

      // ─── PAGE 5: RECENT ACTIVITY ────────────────────────────────────────
      doc.addPage();
      yPos = MARGIN + 20;

      doc.fontSize(20).font(FONTS.bold).fillColor(COLORS.primary).text('Recent Activity', MARGIN, yPos);
      yPos += 34;
      doc.strokeColor(COLORS.brand).lineWidth(2).moveTo(MARGIN, yPos).lineTo(MARGIN + 80, yPos).stroke();
      yPos += 20;

      let hasActivity = false;

      if (stats.recentSales && stats.recentSales.length > 0) {
        hasActivity = true;
        doc.fontSize(12).font(FONTS.bold).fillColor(COLORS.brand).text('Recent Sales', MARGIN, yPos);
        yPos += 18;
        const saleRows = stats.recentSales.slice(0, 5).map((sale: any) => [
          sale.saleNumber || 'N/A',
          sale.customerName || 'Walk-in',
          formatMoney(sale.netAmount || sale.totalAmount || 0),
          formatShortDate(sale.saleDate || sale.createdAt),
        ]);
        yPos = drawTable(
          MARGIN,
          yPos,
          [110, 170, 130, 90],
          ['Sale #', 'Customer', 'Amount', 'Date'],
          saleRows,
          { align: ['left', 'left', 'right', 'right'] },
        );
        yPos += 18;
      }

      if (stats.recentExpenses && stats.recentExpenses.length > 0) {
        hasActivity = true;
        doc.fontSize(12).font(FONTS.bold).fillColor(COLORS.danger).text('Recent Expenses', MARGIN, yPos);
        yPos += 18;
        const expRows = stats.recentExpenses.slice(0, 5).map((expense: any) => [
          expense.category || 'N/A',
          expense.description || 'N/A',
          formatMoney(expense.amount || 0),
          formatShortDate(expense.expenseDate || expense.createdAt),
        ]);
        yPos = drawTable(
          MARGIN,
          yPos,
          [110, 190, 110, 90],
          ['Category', 'Description', 'Amount', 'Date'],
          expRows,
          { align: ['left', 'left', 'right', 'right'] },
        );
      }

      if (!hasActivity) {
        doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.muted)
          .text('No recent activity for this period.', MARGIN, yPos);
      }

      // ─── FOOTERS ──────────────────────────────────────────────────────────
      // Add footers to all pages EXCEPT the first (cover)
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 1; i < totalPages; i++) {
        doc.switchToPage(i);
        const pW = doc.page.width;
        const pH = doc.page.height;
        const margin = MARGIN;

        doc.strokeColor(COLORS.border).lineWidth(0.5).moveTo(margin, pH - 45).lineTo(pW - margin, pH - 45).stroke();
        doc.fontSize(8).font(FONTS.regular).fillColor(COLORS.light);
        doc.text('Smart POS System', margin, pH - 35);
        doc.text(`Page ${i} of ${totalPages - 1}`, margin, pH - 35, { width: contentWidth, align: 'center' });
        doc.text(new Date().toLocaleDateString(), margin, pH - 35, { width: contentWidth, align: 'right' });
      }

      doc.end();
    } catch (error: any) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: error?.message || 'Unknown error',
      });
    }
  }
}
