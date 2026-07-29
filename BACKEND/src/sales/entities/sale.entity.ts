import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { SaleItem } from './sale-item.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'sale_number', unique: true })
  saleNumber: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_amount', default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'tax_amount', default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'discount_amount', default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'net_amount', default: 0 })
  netAmount: number;

  @Column({ default: 'completed' })
  status: string;

  @Column({ name: 'sale_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  saleDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];
}
