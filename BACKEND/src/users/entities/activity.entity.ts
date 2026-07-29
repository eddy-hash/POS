import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  userName: string;
  @Column()
  action: string;
  @Column()
  description: string;
  @Column()
  type: string;
  @Column({ default: 'success' })
  status: string;
  @CreateDateColumn()
  createdAt: Date;
}
