import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status and response body
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : 500;
    const exceptionResponse = isHttp ? exception.getResponse() : {};

    // Build the response body
    const body: any = {
      statusCode: status,
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any)?.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Preserve field errors if present
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const errors = (exceptionResponse as any).errors;
      if (errors) {
        body.errors = errors;
      }
    }

    // Log and send to Sentry only for 5xx errors
    if (status >= 500) {
      this.logger.error(exception);
      Sentry.captureException(exception);
    }

    response.status(status).json(body);
  }
}
