import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CurrencyService } from '../currency/currency.service';


@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepository: Repository<PurchaseItem>,
    private currencyService: CurrencyService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: number): Promise<PurchaseOrder> {
    this.logger.log('Creating purchase order...');

    const lastOrder = await this.purchaseOrderRepository
      .createQueryBuilder('order')
      .orderBy('order.orderNumber', 'DESC')
      .getOne();

    let orderNumber = 'PO-0001';
    if (lastOrder && lastOrder.orderNumber) {
      const match = lastOrder.orderNumber.match(/PO-(\d+)/);
      if (match) {
        const lastNum = parseInt(match[1], 10);
        const nextNum = lastNum + 1;
        orderNumber = `PO-${String(nextNum).padStart(4, '0')}`;
      }
    }

    const { items, supplier, notes, totalAmount } = createPurchaseDto;

    let calculatedTotal = 0;
    for (const item of items) {
      calculatedTotal += item.quantity * item.price;
    }

    const finalTotal = totalAmount || calculatedTotal;

    const purchaseOrder = this.purchaseOrderRepository.create({
      orderNumber,
      userId,
      supplier: supplier || null,
      totalAmount: finalTotal,
      notes: notes || '',
      status: 'active',
      orderDate: new Date(),
    });

    const savedOrder = await this.purchaseOrderRepository.save(purchaseOrder);

    for (const item of items) {
      const totalPrice = item.quantity * item.price;
      const purchaseItem = this.purchaseItemRepository.create({
        purchaseOrderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: totalPrice,
      });
      await this.purchaseItemRepository.save(purchaseItem);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const orders = await this.purchaseOrderRepository.find({
      where: { userId },
      relations: { items: true },
      order: { orderDate: 'DESC' },
    });

    return orders.map(order => {
      const totalAmount = parseFloat(order.totalAmount as any) || 0;
      const convertedTotal = this.currencyService.convert(totalAmount, 'TZS', displayCurrency);
      
      return {
        ...order,
        formattedTotal: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
        formattedTotalShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
        displayCurrency,
        totalTZS: totalAmount,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);

    const totalAmount = parseFloat(order.totalAmount as any) || 0;
    const convertedTotal = this.currencyService.convert(totalAmount, 'TZS', displayCurrency);

    return {
      ...order,
      formattedTotal: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
      formattedTotalShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
      displayCurrency,
      totalTZS: totalAmount,
    };
  }

  async remove(id: number, userId: number): Promise<void> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    await this.purchaseOrderRepository.remove(order);
  }
}
