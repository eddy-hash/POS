import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxAttempts = 10;

    const record = this.attempts.get(ip);
    if (record) {
      if (now > record.resetTime) {
        this.attempts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
      }
      if (record.count >= maxAttempts) {
        throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
      }
      record.count++;
      this.attempts.set(ip, record);
    } else {
      this.attempts.set(ip, { count: 1, resetTime: now + windowMs });
    }
    return true;
  }
}
