import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CurrencyService } from '../currency/currency.service';
import { NotificationTriggersService } from '../notifications/notification-triggers.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private currencyService: CurrencyService,
    private notificationTriggers: NotificationTriggersService, // 👈 injected
  ) {}

  async create(createProductDto: any, userId: number): Promise<Product> {
    this.logger.log('Creating product...');

    if (!createProductDto.sku) {
      createProductDto.sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    createProductDto.quantity = createProductDto.quantity || 0;
    createProductDto.isActive = true;
    createProductDto.userId = userId;

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

  // ─── Update ──────────────────────────────────────────────────────
  async update(id: number, updateProductDto: any, userId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const oldQuantity = product.quantity;
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    // 🔔 Check stock if quantity changed
    if (oldQuantity !== updatedProduct.quantity) {
      const threshold: number = updatedProduct.reorderLevel ?? 5; // ✅ properly typed
      if (updatedProduct.quantity <= threshold) {
        await this.notificationTriggers.onProductLowStock(
          updatedProduct.userId,
          updatedProduct.id,
          updatedProduct.name,
          updatedProduct.quantity,
        );
      }
    }

    return updatedProduct;
  }

  // ─── Delete ──────────────────────────────────────────────────────
  async remove(id: number, userId: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }

  // ─── Stock update (used by purchases and sales) ────────────────
  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const oldQuantity = product.quantity;
    product.quantity = (product.quantity || 0) + quantity;
    const updatedProduct = await this.productRepository.save(product);

    // 🔔 Check stock after update
    const threshold: number = updatedProduct.reorderLevel ?? 5;
    if (updatedProduct.quantity <= threshold && oldQuantity !== updatedProduct.quantity) {
      await this.notificationTriggers.onProductLowStock(
        updatedProduct.userId,
        updatedProduct.id,
        updatedProduct.name,
        updatedProduct.quantity,
      );
    }

    return updatedProduct;
  }

  // ─── Optional: Check all products for low stock ────────────────
  async checkAllLowStock(): Promise<void> {
    const products = await this.productRepository.find({
      where: { isActive: true },
    });

    for (const product of products) {
      const threshold: number = product.reorderLevel ?? 5;
      if (product.quantity <= threshold) {
        await this.notificationTriggers.onProductLowStock(
          product.userId,
          product.id,
          product.name,
          product.quantity,
        );
      }
    }
  }
}