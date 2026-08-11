import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CacheTestController } from './cache-test.controller';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      ttl: 60000, // 60 seconds in milliseconds
      max: 100,
    }),
  ],
  controllers: [CacheTestController],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
