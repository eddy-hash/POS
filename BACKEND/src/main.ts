import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting NestJS application...');
    logger.log('📦 Connecting to database...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    app.enableCors({
      origin: ['http://localhost:3000', 'http://172.16.130.112:3000', 'http://192.168.137.130:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    
    logger.log(`✅ Application is running on: http://localhost:${port}`);
    logger.log(`🌐 Accessible at: http://192.168.137.130:${port}`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
