import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { NotificationTriggersService } from '../notifications/notification-triggers.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private notificationTriggers: NotificationTriggersService,
  ) {}

  async create(createSaleDto: any, userId: number): Promise<Sale> {
    this.logger.log('Creating sale...');
    const { items, ...saleData } = createSaleDto;
    const count = await this.saleRepository.count();
    const saleNumber = `SALE-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
    let totalAmount = 0;
    
    const saleItems = items.map((item: any) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const total = price * quantity;
      totalAmount += total;
      return {
        productId: item.productId,
        productName: item.productName || 'Product',
        price: price,
        unitPrice: price,
        costPrice: item.costPrice || null,
        quantity: quantity,
        total: total,
        totalPrice: total,          // ✅ maps to total_price column
      };
    });
    
    const taxAmount = parseFloat(saleData.taxAmount) || 0;
    const discountAmount = parseFloat(saleData.discountAmount) || 0;
    const netAmount = totalAmount + taxAmount - discountAmount;
    
    const sale = this.saleRepository.create({
      ...saleData,
      userId,
      saleNumber,
      totalAmount,
      taxAmount,
      discountAmount,
      netAmount,
      status: saleData.status || 'completed',
      saleDate: new Date(),
    });
    
    const savedSale = await this.saleRepository.save(sale) as unknown as Sale;
    
    // ✅ Create sale items with proper relation
    for (const item of saleItems) {
      const saleItem = this.saleItemRepository.create({
        sale: savedSale,                 // ✅ relation (not saleId)
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        quantity: item.quantity,
        total: item.total,
        totalPrice: item.totalPrice,     // ✅ camelCase for total_price
      });
      await this.saleItemRepository.save(saleItem);
    }
    
    await this.notificationTriggers.onSaleCreated(
      userId,
      savedSale.id,
      netAmount,
      saleData.customerName,
    );
    
    return this.findOne(savedSale.id);
  }

  async findAll(userId: number): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { userId },
      relations: { items: true },
      order: { saleDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
    return sale;
  }

  async remove(id: number): Promise<void> {
    const sale = await this.findOne(id);
    await this.saleRepository.remove(sale);
  }
}