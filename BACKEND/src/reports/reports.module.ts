import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { CurrencyService } from '../common/services/currency.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Expense, Product, Customer, PurchaseOrder]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, CurrencyService],
  exports: [ReportsService],
})
export class ReportsModule {}
