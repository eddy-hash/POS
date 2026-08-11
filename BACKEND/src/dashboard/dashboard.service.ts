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
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

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

  async getStats(userId: number, displayCurrency: string = 'TZS') {
    this.logger.log(`Fetching dashboard stats for user ${userId} in ${displayCurrency}`);

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

    const salesTrend = await this.getSalesTrend(userId);
    const expenseTrend = await this.getExpenseTrend(userId);
    const topProducts = await this.getTopProducts(userId);

    const profit = totalRevenue - totalExpenses;

    const convertedRevenue = this.currencyService.convert(totalRevenue, 'TZS', displayCurrency);
    const convertedExpenses = this.currencyService.convert(totalExpenses, 'TZS', displayCurrency);
    const convertedProfit = this.currencyService.convert(profit, 'TZS', displayCurrency);

    const symbol = this.currencyService.getSymbol(displayCurrency);

    return {
      totalSales,
      totalRevenue: convertedRevenue,
      totalExpenses: convertedExpenses,
      profit: convertedProfit,
      totalCustomers,
      totalProducts,
      totalPurchases,
      salesTrend,
      expenseTrend,
      topProducts,
      displayCurrency,
      symbol,
      // ✅ Abbreviated format for cards
      formatted: {
        totalRevenue: this.currencyService.formatCurrency(convertedRevenue, displayCurrency, true),
        totalExpenses: this.currencyService.formatCurrency(convertedExpenses, displayCurrency, true),
        profit: this.currencyService.formatCurrency(convertedProfit, displayCurrency, true),
      },
      // ✅ Full format for details
      formattedFull: {
        totalRevenue: this.currencyService.formatCurrencyFull(convertedRevenue, displayCurrency),
        totalExpenses: this.currencyService.formatCurrencyFull(convertedExpenses, displayCurrency),
        profit: this.currencyService.formatCurrencyFull(convertedProfit, displayCurrency),
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
}
