import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SalesModule } from './sales/sales.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CustomersModule } from './customers/customers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { CacheModule } from './cache/cache.module';
import { SentryModule } from './sentry/sentry.module';
import { CurrencyModule } from './currency/currency.module';
import { PurchaseOrder } from './purchases/entities/purchase-order.entity';
import { PurchaseItem } from './purchases/entities/purchase-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'pos'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PurchaseOrder, PurchaseItem]),
    HealthModule,
    CacheModule,
    SentryModule,
    CurrencyModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SalesModule,
    ExpensesModule,
    PurchasesModule,
    CustomersModule,
    NotificationsModule,
    ReportsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
