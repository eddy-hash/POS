import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Expense, Product, Customer, PurchaseOrder]),
    CurrencyModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
