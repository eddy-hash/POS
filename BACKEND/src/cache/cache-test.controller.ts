import { Controller, Get, Param, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache-test')
export class CacheTestController {
  private readonly logger = new Logger(CacheTestController.name);

  constructor(private cacheService: CacheService) {}

  @Get('set/:key/:value')
  async set(@Param('key') key: string, @Param('value') value: string) {
    await this.cacheService.set(key, value);
    return { message: `Cached: ${key} = ${value}` };
  }

  @Get('get/:key')
  async get(@Param('key') key: string) {
    const value = await this.cacheService.get(key);
    return { key, value };
  }

  @Get('remember/:key/:value')
  async remember(@Param('key') key: string, @Param('value') value: string) {
    const result = await this.cacheService.remember(
      key,
      async () => {
        this.logger.log(`Computing value for ${key}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return value;
      },
      30,
    );
    return { key, result };
  }

  // ✅ Remove clear endpoint - use del with specific keys instead
  @Get('delete/:key')
  async delete(@Param('key') key: string) {
    await this.cacheService.del(key);
    return { message: `Deleted: ${key}` };
  }
}
