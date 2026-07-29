import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationTriggersService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async onSaleCreated(userId: number, saleId: number, amount: number, customerName?: string) {
    const notification = this.notificationRepository.create({
      userId,
      title: 'New Sale',
      message: `Sale #${saleId} for ${amount} ${customerName ? 'by ' + customerName : ''}`,
      type: 'sale',
      referenceId: saleId,
      isRead: false,
    });
    await this.notificationRepository.save(notification);
  }

  async onExpenseCreated(userId: number, expenseId: number, amount: number, category?: string) {
    const notification = this.notificationRepository.create({
      userId,
      title: 'New Expense',
      message: `Expense #${expenseId} for ${amount} ${category ? 'in ' + category : ''}`,
      type: 'expense',
      referenceId: expenseId,
      isRead: false,
    });
    await this.notificationRepository.save(notification);
  }

  async onPurchaseCreated(userId: number, purchaseId: number, amount: number, supplierName?: string) {
    const notification = this.notificationRepository.create({
      userId,
      title: 'New Purchase',
      message: `Purchase #${purchaseId} for ${amount} ${supplierName ? 'from ' + supplierName : ''}`,
      type: 'purchase',
      referenceId: purchaseId,
      isRead: false,
    });
    await this.notificationRepository.save(notification);
  }

  async onCustomerCreated(userId: number, customerId: number, customerName: string) {
    const notification = this.notificationRepository.create({
      userId,
      title: 'New Customer',
      message: `Customer ${customerName} registered`,
      type: 'customer',
      referenceId: customerId,
      isRead: false,
    });
    await this.notificationRepository.save(notification);
  }

  async onProductLowStock(userId: number, productId: number, productName: string, quantity: number) {
    const notification = this.notificationRepository.create({
      userId,
      title: 'Low Stock Alert',
      message: `Product "${productName}" is running low (${quantity} units left)`,
      type: 'inventory',
      referenceId: productId,
      isRead: false,
    });
    await this.notificationRepository.save(notification);
  }
}
