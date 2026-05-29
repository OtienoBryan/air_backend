import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('supplier_ledger')
export class SupplierLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'date', type: 'datetime' })
  date: Date;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string | null;

  @Column({ name: 'reference_id', type: 'int', nullable: true })
  referenceId: number | null;

  @Column({ name: 'debit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column({ name: 'credit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number;

  @Column({ name: 'running_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  runningBalance: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Supplier, supplier => supplier.id)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
}
