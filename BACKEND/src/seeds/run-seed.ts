import { DataSource } from 'typeorm';
import { seedProducts } from './product.seed';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'pos',
  entities: [User, Product, Category],
  synchronize: true,
});

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected!');
    await seedProducts(AppDataSource);
    console.log('✅ Seeding completed!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

runSeed();
