import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { CurrencyService } from '../currency/currency.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Expense, Product, Customer, PurchaseOrder]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, CurrencyService],
  exports: [DashboardService],
})
export class DashboardModule {}
