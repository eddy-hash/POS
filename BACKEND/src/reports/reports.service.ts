import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async getUserInfo(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getStats(userId: number, range: string) {
    this.logger.log(`Fetching reports for user ${userId}, range: ${range}`);

    // Get date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // 1. Total Sales Count
    const totalSales = await this.saleRepository.count({
      where: { userId },
    });
    this.logger.log(`Total sales: ${totalSales}`);

    // 2. Total Revenue
    const revenueResult = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.userId = :userId', { userId })
      .select('COALESCE(SUM(sale.netAmount), 0)', 'total')
      .getRawOne();
    const totalRevenue = Number(revenueResult?.total) || 0;
    this.logger.log(`Total revenue: ${totalRevenue}`);

    // 3. Total Expenses
    const expenseResult = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .getRawOne();
    const totalExpenses = Number(expenseResult?.total) || 0;
    this.logger.log(`Total expenses: ${totalExpenses}`);

    // 4. Total Customers
    const totalCustomers = await this.customerRepository.count({
      where: { userId },
    });
    this.logger.log(`Total customers: ${totalCustomers}`);

    // 5. Total Products
    const totalProducts = await this.productRepository.count();
    this.logger.log(`Total products: ${totalProducts}`);

    // 6. Sales Trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.userId = :userId', { userId })
      .andWhere('sale.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .select('DATE(sale.createdAt)', 'date')
      .addSelect('COALESCE(SUM(sale.netAmount), 0)', 'amount')
      .groupBy('DATE(sale.createdAt)')
      .orderBy('DATE(sale.createdAt)', 'ASC')
      .getRawMany();

    // 7. Expense Trend (last 7 days)
    const expenseTrend = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .select('DATE(expense.createdAt)', 'date')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'amount')
      .groupBy('DATE(expense.createdAt)')
      .orderBy('DATE(expense.createdAt)', 'ASC')
      .getRawMany();

    // 8. Top Products
    const topProducts = await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoin('sale.items', 'item')
      .where('sale.userId = :userId', { userId })
      .select('item.productName', 'name')
      .addSelect('COALESCE(SUM(item.total), 0)', 'sales')
      .groupBy('item.productName')
      .orderBy('SUM(item.total)', 'DESC')
      .limit(5)
      .getRawMany();

    // 9. Recent Sales
    const recentSales = await this.saleRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // 10. Recent Expenses
    const recentExpenses = await this.expenseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // 11. Low Stock Items
    const lowStockItems = await this.productRepository
      .createQueryBuilder('product')
      .where('product.quantity <= 10')
      .andWhere('product.quantity > 0')
      .orderBy('product.quantity', 'ASC')
      .take(5)
      .getMany();

    // 12. Monthly Stats (last 6 months)
    const monthlyStats = await this.getMonthlyStats(userId);

    return {
      totalSales,
      totalRevenue,
      totalExpenses,
      totalCustomers,
      totalProducts,
      profit: totalRevenue - totalExpenses,
      salesTrend: salesTrend.map(s => ({ 
        date: s.date, 
        amount: Number(s.amount) || 0 
      })),
      expenseTrend: expenseTrend.map(e => ({ 
        date: e.date, 
        amount: Number(e.amount) || 0 
      })),
      topProducts: topProducts.map(p => ({
        name: p.name || 'Unknown',
        sales: Number(p.sales) || 0
      })),
      recentSales: recentSales.map(s => ({
        ...s,
        netAmount: Number(s.netAmount) || 0,
        totalAmount: Number(s.totalAmount) || 0,
      })),
      recentExpenses: recentExpenses.map(e => ({
        ...e,
        amount: Number(e.amount) || 0,
      })),
      lowStockItems: lowStockItems.map(p => ({
        ...p,
        quantity: Number(p.quantity) || 0,
        price: Number(p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
      })),
      monthlyStats,
    };
  }

  private async getMonthlyStats(userId: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      const month = months[monthIndex];
      
      // Get revenue for this month
      const revenueResult = await this.saleRepository
        .createQueryBuilder('sale')
        .where('sale.userId = :userId', { userId })
        .andWhere('EXTRACT(YEAR FROM sale.createdAt) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM sale.createdAt) = :month', { month: monthIndex + 1 })
        .select('COALESCE(SUM(sale.netAmount), 0)', 'total')
        .getRawOne();
      const revenue = Number(revenueResult?.total) || 0;
      
      // Get expenses for this month
      const expenseResult = await this.expenseRepository
        .createQueryBuilder('expense')
        .where('expense.userId = :userId', { userId })
        .andWhere('EXTRACT(YEAR FROM expense.createdAt) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM expense.createdAt) = :month', { month: monthIndex + 1 })
        .select('COALESCE(SUM(expense.amount), 0)', 'total')
        .getRawOne();
      const expenses = Number(expenseResult?.total) || 0;
      
      monthlyStats.push({
        month,
        revenue,
        expenses,
        profit: revenue - expenses,
      });
    }
    
    return monthlyStats;
  }
}
