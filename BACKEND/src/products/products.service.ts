import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private currencyService: CurrencyService,
  ) {}

  async create(createProductDto: any, userId: number): Promise<Product> {
    this.logger.log('Creating product...');

    if (!createProductDto.sku) {
      createProductDto.sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    createProductDto.quantity = createProductDto.quantity || 0;
    createProductDto.isActive = true;
    createProductDto.userId = userId;

    // ✅ Simple approach: create and save
    const product = new Product();
    Object.assign(product, createProductDto);
    
    const savedProduct = await this.productRepository.save(product);
    this.logger.log(`✅ Product created: ${savedProduct.name} (${savedProduct.sku})`);
    return savedProduct;
  }

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    this.logger.log(`📦 Fetching products for user ${userId} in ${displayCurrency}`);
    
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.userId = :userId', { userId })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('product.category', 'category')
      .getMany();

    this.logger.log(`📦 Found ${products.length} products for user ${userId}`);

    return products.map((product) => {
      const price = Number(product.price) || 0;
      const costPrice = Number(product.costPrice) || 0;
      
      const convertedPrice = this.currencyService.convert(price, 'TZS', displayCurrency);
      const convertedCostPrice = this.currencyService.convert(costPrice, 'TZS', displayCurrency);

      return {
        ...product,
        formattedPrice: this.currencyService.formatCurrencyFull(convertedPrice, displayCurrency),
        formattedPriceShort: this.currencyService.formatCurrency(convertedPrice, displayCurrency, true),
        formattedCostPrice: this.currencyService.formatCurrencyFull(convertedCostPrice, displayCurrency),
        displayCurrency,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const price = Number(product.price) || 0;
    const costPrice = Number(product.costPrice) || 0;
    
    const convertedPrice = this.currencyService.convert(price, 'TZS', displayCurrency);
    const convertedCostPrice = this.currencyService.convert(costPrice, 'TZS', displayCurrency);

    return {
      ...product,
      formattedPrice: this.currencyService.formatCurrencyFull(convertedPrice, displayCurrency),
      formattedPriceShort: this.currencyService.formatCurrency(convertedPrice, displayCurrency, true),
      formattedCostPrice: this.currencyService.formatCurrencyFull(convertedCostPrice, displayCurrency),
      displayCurrency,
    };
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.quantity = (product.quantity || 0) + quantity;
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }
}
