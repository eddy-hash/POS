import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { RawBodyMiddleware } from '../common/middleware/raw-body.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseItem])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'purchases', method: RequestMethod.POST });
  }
}
