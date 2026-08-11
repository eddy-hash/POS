import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { Sale } from '../sales/entities/sale.entity';
import { CurrencyService } from '../common/services/currency.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Sale]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CurrencyService],
  exports: [CustomersService],
})
export class CustomersModule {}
