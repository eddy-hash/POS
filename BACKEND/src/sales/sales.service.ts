import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { NotificationTriggersService } from '../notifications/notification-triggers.service';
import { CurrencyService } from '../currency/currency.service';

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
    private currencyService: CurrencyService,
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
        totalPrice: total,
      };
    });

    const taxAmount = parseFloat(saleData.taxAmount) || 0;
    const discountAmount = parseFloat(saleData.discountAmount) || 0;
    const netAmount = totalAmount + taxAmount - discountAmount;

    const sale = new Sale();
    sale.userId = userId;
    sale.saleNumber = saleNumber;
    sale.totalAmount = totalAmount;
    sale.taxAmount = taxAmount;
    sale.discountAmount = discountAmount;
    sale.netAmount = netAmount;
    sale.status = saleData.status || 'completed';
    sale.saleDate = new Date();
    sale.customerName = saleData.customerName || '';

    const savedSale = await this.saleRepository.save(sale);

    for (const item of saleItems) {
      const saleItem = this.saleItemRepository.create({
        saleId: savedSale.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        quantity: item.quantity,
        total: item.total,
        totalPrice: item.totalPrice,
      });
      await this.saleItemRepository.save(saleItem);
    }

    // 🔔 Trigger notification
    await this.notificationTriggers.onSaleCreated(
      userId,
      savedSale.id,
      netAmount,
      saleData.customerName,
    );

    return this.findOne(savedSale.id);
  }

  // ✅ Updated with currency support
  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const sales = await this.saleRepository.find({
      where: { userId },
      relations: { items: true },
      order: { saleDate: 'DESC' },
    });

    return sales.map((sale) => {
      const netAmount = sale.netAmount || 0;
      const convertedAmount = this.currencyService.convert(netAmount, 'TZS', displayCurrency);
      return {
        ...sale,
        formattedTotal: this.currencyService.formatCurrencyFull(convertedAmount, displayCurrency),
        formattedTotalShort: this.currencyService.formatCurrency(convertedAmount, displayCurrency, true),
        displayCurrency,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: { items: true },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const netAmount = sale.netAmount || 0;
    const convertedAmount = this.currencyService.convert(netAmount, 'TZS', displayCurrency);
    return {
      ...sale,
      formattedTotal: this.currencyService.formatCurrencyFull(convertedAmount, displayCurrency),
      formattedTotalShort: this.currencyService.formatCurrency(convertedAmount, displayCurrency, true),
      displayCurrency,
    };
  }

  async remove(id: number): Promise<void> {
    const sale = await this.saleRepository.findOne({ where: { id } });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    await this.saleRepository.remove(sale);
  }
}