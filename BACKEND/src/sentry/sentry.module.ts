import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryFilter } from '../common/filters/sentry.filter';
import { SentryInterceptor } from '../common/interceptors/sentry.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class SentryModule {}
