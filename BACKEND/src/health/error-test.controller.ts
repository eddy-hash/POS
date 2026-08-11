import { Controller, Get } from '@nestjs/common';

@Controller('error-test')
export class ErrorTestController {
  @Get()
  testError() {
    throw new Error('This is a test error for Sentry monitoring!');
  }
}
