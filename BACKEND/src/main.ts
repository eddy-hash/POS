import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import helmet from 'helmet';
import { setupSwagger } from './swagger/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
    logger.log('✅ Sentry initialized');
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.use(helmet());

  app.use((req, res, next) => {
    const start = Date.now();
    const originalEnd = res.end;
    res.end = function (...args) {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      const method = req.method;
      const url = req.originalUrl || req.url;
      // Log to console – this goes to PM2 logs
      console.log(`➡️ ${method} ${url} ${statusCode} - ${duration}ms`);
      // Call the original end
      originalEnd.apply(this, args);
    };
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      validationError: { target: false, value: true },
      exceptionFactory: (errors) => {
        const fieldErrors = {};
        errors.forEach((error) => {
          if (error.constraints) {
            fieldErrors[error.property] = Object.values(error.constraints).join(', ');
          }
          if (error.children && error.children.length > 0) {
            error.children.forEach((child) => {
              if (child.constraints) {
                fieldErrors[child.property] = Object.values(child.constraints).join(', ');
              }
            });
          }
        });

        console.log('🔴 VALIDATION ERRORS');
        errors.forEach((error) => {
          console.log(`❌ Property: ${error.property}`);
          console.log(`❌ Value: ${error.value}`);
          console.log(`❌ Constraints:`, error.constraints);
          if (error.children && error.children.length > 0) {
            console.log(
              `❌ Children:`,
              error.children.map((c) => ({
                property: c.property,
                constraints: c.constraints,
              })),
            );
          }
          console.log('---');
        });
        console.log('🔴 ===');

        return new BadRequestException({
          message: 'Validation failed',
          errors: fieldErrors,
        });
      },
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
  });

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RequestLoggerInterceptor(),
  );

  setupSwagger(app);

  const port = process.env.PORT || 3001;
  await app.listen(port, '127.0.0.1');

  logger.log(`✅ Application running on: http://localhost:${port}`);
  logger.log(`📚 API Docs: http://localhost:${port}/api-docs`);
}

bootstrap();