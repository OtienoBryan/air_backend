import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExpenseCategory } from './expense-category.entity';

@Entity('expense_types')
export class ExpenseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  category_id: number | null;

  @ManyToOne(() => ExpenseCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: ExpenseCategory | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
