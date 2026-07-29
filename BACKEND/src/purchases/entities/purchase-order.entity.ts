import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', length: 50, unique: true })
  orderNumber: string;

  @Column({ nullable: true, length: 255 })
  supplier: string;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId?: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'order_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ name: 'received_date', type: 'timestamp', nullable: true })
  receivedDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PurchaseItem, (item) => item.purchaseOrder, { cascade: true })
  items: PurchaseItem[];
}
