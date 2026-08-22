import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RawBody');

  use(req: Request, res: Response, next: NextFunction) {
    // Only log POST requests to /purchases
    if (req.method === 'POST' && req.path === '/purchases') {
      let rawBody = '';
      req.on('data', chunk => {
        rawBody += chunk.toString();
      });
      
      req.on('end', () => {
        if (rawBody) {
          this.logger.log('📦 ===== RAW REQUEST BODY =====');
          this.logger.log(`📦 Body: ${rawBody}`);
          try {
            const parsed = JSON.parse(rawBody);
            this.logger.log(`📦 Parsed: ${JSON.stringify(parsed, null, 2)}`);
            this.logger.log(`📦 Items count: ${parsed.items?.length || 0}`);
          } catch (e) {
            this.logger.warn(`⚠️ Could not parse JSON: ${e.message}`);
          }
          this.logger.log('📦 ============================');
        }
      });
    }
    
    next();
  }
}
