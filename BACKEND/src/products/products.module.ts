
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CurrencyModule } from '../currency/currency.module';  
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CurrencyModule,         
    NotificationsModule,  
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}