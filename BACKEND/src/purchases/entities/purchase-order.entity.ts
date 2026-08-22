import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', unique: true, length: 50 })
  orderNumber: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId: number;

  @Column({ nullable: true, length: 255 })
  supplier: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ length: 50, default: 'active' })
  status: string;

  @Column({ name: 'order_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ name: 'received_date', type: 'timestamp', nullable: true })
  receivedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PurchaseItem, item => item.purchaseOrder, { cascade: true })
  items: PurchaseItem[];
}
