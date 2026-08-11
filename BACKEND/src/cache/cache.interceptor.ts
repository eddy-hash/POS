import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = `route:${request.method}:${request.url}`;

    const cached = await this.cacheService.get(key);
    if (cached) return of(cached);

    return next.handle().pipe(
      tap(async data => {
        await this.cacheService.set(key, data, 60);
      }),
    );
  }
}
