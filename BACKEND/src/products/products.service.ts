import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: any): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    // Ensure we return a single product, not an array
    return Array.isArray(savedProduct) ? savedProduct[0] : savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return Array.isArray(updatedProduct) ? updatedProduct[0] : updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.quantity = quantity;
    const updatedProduct = await this.productRepository.save(product);
    return Array.isArray(updatedProduct) ? updatedProduct[0] : updatedProduct;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { categoryId },
      relations: { category: true },
    });
  }

  async search(query: string): Promise<Product[]> {
    if (!query || query.trim() === '') {
      return this.findAll();
    }
    
    const searchTerm = `%${query.toLowerCase()}%`;
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('LOWER(product.name) LIKE :searchTerm', { searchTerm })
      .orWhere('LOWER(product.sku) LIKE :searchTerm', { searchTerm })
      .orWhere('LOWER(product.description) LIKE :searchTerm', { searchTerm })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.quantity <= :threshold', { threshold })
      .andWhere('product.quantity > 0')
      .orderBy('product.quantity', 'ASC')
      .getMany();
  }

  async getOutOfStock(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.quantity = 0')
      .getMany();
  }
}
