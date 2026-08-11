import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          Sentry.addBreadcrumb({
            message: `Request completed in ${duration}ms`,
            category: 'performance',
            level: 'info',
            data: { method, url, duration },
          });
        },
        error: (error) => {
          const duration = Date.now() - start;
          Sentry.addBreadcrumb({
            message: `Request failed in ${duration}ms`,
            category: 'performance',
            level: 'error',
            data: { method, url, duration, error: error.message },
          });
        },
      }),
    );
  }
}
