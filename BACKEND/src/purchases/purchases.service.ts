import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepository: Repository<PurchaseItem>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: number): Promise<PurchaseOrder> {
    this.logger.log('Creating purchase order...');

    const count = await this.purchaseOrderRepository.count();
    const orderNumber = `PO-${String(count + 1).padStart(4, '0')}`;

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

  async findAll(userId: number): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find({
      where: { userId },
      relations: { items: true },
      order: { orderDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    return order;
  }

  async remove(id: number, userId: number): Promise<void> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    await this.purchaseOrderRepository.remove(order);
  }
}
