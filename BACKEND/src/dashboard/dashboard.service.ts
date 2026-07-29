import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getStats(userId: number) {
    this.logger.log(`Fetching dashboard stats for user ${userId}`);

    try {
      // Get total sales count
      const totalSales = await this.saleRepository.count({ 
        where: { userId } 
      });
      this.logger.log(`Total sales: ${totalSales}`);

      // Get total revenue
      const revenueResult = await this.saleRepository
        .createQueryBuilder('sale')
        .where('sale.userId = :userId', { userId })
        .select('COALESCE(SUM(sale.netAmount), 0)', 'total')
        .getRawOne();
      const totalRevenue = Number(revenueResult?.total) || 0;
      this.logger.log(`Total revenue: ${totalRevenue}`);

      // Get total expenses
      const expenseResult = await this.expenseRepository
        .createQueryBuilder('expense')
        .where('expense.userId = :userId', { userId })
        .select('COALESCE(SUM(expense.amount), 0)', 'total')
        .getRawOne();
      const totalExpenses = Number(expenseResult?.total) || 0;
      this.logger.log(`Total expenses: ${totalExpenses}`);

      // Get total customers
      const totalCustomers = await this.userRepository.count();
      this.logger.log(`Total customers: ${totalCustomers}`);

      // Get total products
      const totalProducts = await this.productRepository.count();
      this.logger.log(`Total products: ${totalProducts}`);

      // Get recent sales (last 5)
      const recentSales = await this.saleRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 5,
      });

      // Get recent expenses (last 5)
      const recentExpenses = await this.expenseRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 5,
      });

      // Get low stock items (quantity <= 10 and > 0)
      let lowStockItems = [];
      try {
        lowStockItems = await this.productRepository
          .createQueryBuilder('product')
          .where('product.quantity <= 10')
          .andWhere('product.quantity > 0')
          .orderBy('product.quantity', 'ASC')
          .take(5)
          .getMany();
      } catch (error: any) {
        this.logger.warn('Could not fetch low stock items:', error?.message || 'Unknown error');
        lowStockItems = [];
      }

      // Get top products by sales (for chart) - FIXED
      let topProducts = [];
      try {
        topProducts = await this.saleRepository
          .createQueryBuilder('sale')
          .leftJoin('sale.items', 'item')
          .where('sale.userId = :userId', { userId })
          .select('item.productName', 'name')
          .addSelect('COALESCE(SUM(item.total), 0)', 'sales')
          .groupBy('item.productName')
          .orderBy('SUM(item.total)', 'DESC')
          .limit(5)
          .getRawMany();
        
        // Filter out null/empty product names
        topProducts = topProducts.filter(p => p.name && p.name !== 'null' && p.name !== '');
        
        // Convert sales to number
        topProducts = topProducts.map(p => ({
          ...p,
          sales: Number(p.sales) || 0
        }));
        
        this.logger.log(`Top products: ${JSON.stringify(topProducts)}`);
      } catch (error: any) {
        this.logger.warn('Could not fetch top products:', error?.message || 'Unknown error');
        topProducts = [];
      }

      // Get sales trend (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      let salesTrend = [];
      try {
        salesTrend = await this.saleRepository
          .createQueryBuilder('sale')
          .where('sale.userId = :userId', { userId })
          .andWhere('sale.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
          .select('DATE(sale.createdAt)', 'date')
          .addSelect('COALESCE(SUM(sale.netAmount), 0)', 'amount')
          .groupBy('DATE(sale.createdAt)')
          .orderBy('DATE(sale.createdAt)', 'ASC')
          .getRawMany();
      } catch (error: any) {
        this.logger.warn('Could not fetch sales trend:', error?.message || 'Unknown error');
        salesTrend = [];
      }

      // Get expense trend (last 7 days)
      let expenseTrend = [];
      try {
        expenseTrend = await this.expenseRepository
          .createQueryBuilder('expense')
          .where('expense.userId = :userId', { userId })
          .andWhere('expense.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
          .select('DATE(expense.createdAt)', 'date')
          .addSelect('COALESCE(SUM(expense.amount), 0)', 'amount')
          .groupBy('DATE(expense.createdAt)')
          .orderBy('DATE(expense.createdAt)', 'ASC')
          .getRawMany();
      } catch (error: any) {
        this.logger.warn('Could not fetch expense trend:', error?.message || 'Unknown error');
        expenseTrend = [];
      }

      const stats = {
        totalSales,
        totalRevenue,
        totalExpenses,
        totalCustomers,
        totalProducts,
        recentSales: recentSales.map(s => ({ ...s, items: [] })),
        recentExpenses,
        lowStockItems,
        topProducts,
        salesTrend: salesTrend.map(s => ({ date: s.date, amount: Number(s.amount) || 0 })),
        expenseTrend: expenseTrend.map(e => ({ date: e.date, amount: Number(e.amount) || 0 })),
      };

      this.logger.log(`Final stats: totalProducts=${stats.totalProducts}, topProducts=${stats.topProducts.length}`);
      return stats;
    } catch (error: any) {
      this.logger.error('Error fetching dashboard stats:', error?.message || 'Unknown error');
      throw error;
    }
  }
}
