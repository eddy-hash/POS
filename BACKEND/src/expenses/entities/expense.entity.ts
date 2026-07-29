import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'user_id' })
  userId: number;
  @Column()
  category: string;
  @Column({ nullable: true })
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  @Column({ name: 'expense_date', default: () => 'CURRENT_TIMESTAMP' })
  expenseDate: Date;
  @Column({ name: 'receipt_path', nullable: true })
  receiptPath: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
