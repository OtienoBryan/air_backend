import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SalesOrder } from './sales-order.entity';

@Entity('sales_order_items')
export class SalesOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sales_order_id' })
  salesOrderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 11, scale: 2 })
  taxAmount: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ 
    name: 'tax_type', 
    type: 'enum', 
    enum: ['16%', 'zero_rated', 'exempted'],
    default: '16%'
  })
  taxType: '16%' | 'zero_rated' | 'exempted';

  @Column({ name: 'net_price', type: 'decimal', precision: 11, scale: 2 })
  netPrice: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 11, scale: 2 })
  unitCost: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 11, scale: 2 })
  costPrice: number;

  @Column({ name: 'shipped_quantity', type: 'int' })
  shippedQuantity: number;

  @ManyToOne(() => SalesOrder, salesOrder => salesOrder.id)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;
}
