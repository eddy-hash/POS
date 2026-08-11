import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(PurchaseOrder)
    private purchaseRepository: Repository<PurchaseOrder>,
    private currencyService: CurrencyService,
  ) {}

  // ✅ Accept 3 arguments: userId, range, displayCurrency
  async getStats(
    userId: number,
    range: string = 'month',
    displayCurrency: string = 'TZS',
  ): Promise<any> {
    this.logger.log(`Fetching reports for user ${userId}, range: ${range}, currency: ${displayCurrency}`);

    const sales = await this.saleRepository.find({
      where: { userId },
      order: { saleDate: 'DESC' },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.netAmount || 0), 0);
    const totalExpenses = await this.getTotalExpenses(userId);
    const totalCustomers = await this.customerRepository.count({ where: { userId } });
    const totalProducts = await this.productRepository.count({ where: { isActive: true } });
    const totalPurchases = await this.purchaseRepository.count({ where: { userId } });
    const profit = totalRevenue - totalExpenses;

    const salesTrend = await this.getSalesTrend(userId);
    const expenseTrend = await this.getExpenseTrend(userId);
    const topProducts = await this.getTopProducts(userId);
    const monthlyStats = await this.getMonthlyStats(userId, displayCurrency);

    const recentSales = sales.slice(0, 5);
    const recentExpenses = await this.expenseRepository.find({
      where: { userId },
      order: { expenseDate: 'DESC' },
      take: 5,
    });
    const lowStockItems = await this.productRepository.find({
      where: { isActive: true },
      order: { quantity: 'ASC' },
      take: 5,
    });

    // ✅ Convert all amounts to display currency
    const convertedRevenue = this.currencyService.convert(totalRevenue, 'TZS', displayCurrency);
    const convertedExpenses = this.currencyService.convert(totalExpenses, 'TZS', displayCurrency);
    const convertedProfit = this.currencyService.convert(profit, 'TZS', displayCurrency);

    return {
      totalSales,
      totalRevenue: convertedRevenue,
      totalExpenses: convertedExpenses,
      totalCustomers,
      totalProducts,
      totalPurchases,
      profit: convertedProfit,
      salesTrend,
      expenseTrend,
      topProducts,
      monthlyStats,
      recentSales,
      recentExpenses,
      lowStockItems,
      displayCurrency,
      formatted: {
        totalRevenue: this.currencyService.formatCurrencyFull(convertedRevenue, displayCurrency),
        totalRevenueShort: this.currencyService.formatCurrency(convertedRevenue, displayCurrency, true),
        totalExpenses: this.currencyService.formatCurrencyFull(convertedExpenses, displayCurrency),
        totalExpensesShort: this.currencyService.formatCurrency(convertedExpenses, displayCurrency, true),
        profit: this.currencyService.formatCurrencyFull(convertedProfit, displayCurrency),
        profitShort: this.currencyService.formatCurrency(convertedProfit, displayCurrency, true),
      },
    };
  }

  private async getTotalExpenses(userId: number): Promise<number> {
    const expenses = await this.expenseRepository.find({ where: { userId } });
    return expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }

  private async getSalesTrend(userId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.userId = :userId', { userId })
      .andWhere('sale.saleDate >= :date', { date: sevenDaysAgo })
      .orderBy('sale.saleDate', 'ASC')
      .getMany();

    const trend: { date: string; amount: number }[] = [];
    const dateMap = new Map<string, number>();

    for (const sale of sales) {
      const date = sale.saleDate.toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + Number(sale.netAmount || 0));
    }

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      trend.push({
        date: key,
        amount: dateMap.get(key) || 0,
      });
    }

    return trend;
  }

  private async getExpenseTrend(userId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const expenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.expenseDate >= :date', { date: sevenDaysAgo })
      .orderBy('expense.expenseDate', 'ASC')
      .getMany();

    const trend: { date: string; amount: number }[] = [];
    const dateMap = new Map<string, number>();

    for (const expense of expenses) {
      const date = expense.expenseDate.toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + Number(expense.amount || 0));
    }

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      trend.push({
        date: key,
        amount: dateMap.get(key) || 0,
      });
    }

    return trend;
  }

  private async getTopProducts(userId: number) {
    const sales = await this.saleRepository.find({
      where: { userId },
      relations: { items: true },
    });

    const productMap = new Map<number, { name: string; sales: number }>();

    for (const sale of sales) {
      for (const item of sale.items || []) {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.sales += Number(item.total || 0);
        } else {
          productMap.set(item.productId, {
            name: item.productName || 'Unknown',
            sales: Number(item.total || 0),
          });
        }
      }
    }

    return Array.from(productMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }

  private async getMonthlyStats(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const sales = await this.saleRepository.find({
      where: { userId },
      order: { saleDate: 'DESC' },
    });

    const monthlyMap = new Map<string, { revenue: number; expenses: number; profit: number }>();

    for (const sale of sales) {
      const month = sale.saleDate.toISOString().slice(0, 7);
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { revenue: 0, expenses: 0, profit: 0 });
      }
      const data = monthlyMap.get(month)!;
      data.revenue += Number(sale.netAmount || 0);
    }

    const expenses = await this.expenseRepository.find({ where: { userId } });
    for (const expense of expenses) {
      const month = expense.expenseDate.toISOString().slice(0, 7);
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { revenue: 0, expenses: 0, profit: 0 });
      }
      const data = monthlyMap.get(month)!;
      data.expenses += Number(expense.amount || 0);
    }

    const result = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, data]) => {
        const convertedRevenue = this.currencyService.convert(data.revenue, 'TZS', displayCurrency);
        const convertedExpenses = this.currencyService.convert(data.expenses, 'TZS', displayCurrency);
        const convertedProfit = this.currencyService.convert(data.revenue - data.expenses, 'TZS', displayCurrency);
        
        return {
          month,
          revenue: convertedRevenue,
          expenses: convertedExpenses,
          profit: convertedProfit,
          formatted: {
            revenue: this.currencyService.formatCurrencyFull(convertedRevenue, displayCurrency),
            revenueShort: this.currencyService.formatCurrency(convertedRevenue, displayCurrency, true),
            expenses: this.currencyService.formatCurrencyFull(convertedExpenses, displayCurrency),
            expensesShort: this.currencyService.formatCurrency(convertedExpenses, displayCurrency, true),
            profit: this.currencyService.formatCurrencyFull(convertedProfit, displayCurrency),
            profitShort: this.currencyService.formatCurrency(convertedProfit, displayCurrency, true),
          },
        };
      });

    return result;
  }
}
