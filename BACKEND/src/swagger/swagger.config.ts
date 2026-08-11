import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: any) => {
  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('Professional Point of Sale System Backend API')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management')
    .addTag('sales', 'Sales transactions')
    .addTag('purchases', 'Purchase orders')
    .addTag('customers', 'Customer management')
    .addTag('expenses', 'Expense tracking')
    .addTag('reports', 'Reports & analytics')
    .addTag('dashboard', 'Dashboard statistics')
    .addTag('cache', 'Cache testing')
    .addTag('health', 'Health checks')
    .addServer('http://localhost:3001', 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css',
    customSiteTitle: 'POS System API Documentation',
  });

  console.log('📚 Swagger API Docs available at: http://localhost:3001/api-docs');
};
