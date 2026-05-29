import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Staff } from './staff.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  CANCELLED = 'cancelled'
}

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  po_number: string;

  @Column({ type: 'varchar', length: 200 })
  invoice_number: string;

  @Column({ type: 'int' })
  supplier_id: number;

  @Column({ type: 'date' })
  order_date: Date;

  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date | null;

  @Column({ 
    type: 'enum', 
    enum: PurchaseOrderStatus, 
    default: PurchaseOrderStatus.DRAFT 
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  amount_paid: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  balance: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int' })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  creator: Staff;

  @OneToMany(() => PurchaseOrderItem, item => item.purchase_order)
  items: PurchaseOrderItem[];
}
