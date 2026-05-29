import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'so_number', type: 'varchar', length: 20, unique: true })
  soNumber: string;

  @Column({ name: 'client_id', type: 'int' })
  clientId: number;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate?: Date;

  @Column({ name: 'subtotal', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  totalAmount: number;

  @Column({ name: 'net_price', type: 'decimal', precision: 11, scale: 2 })
  netPrice: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: true })
  createdBy?: string;

  @Column({ name: 'salesrep', type: 'int', nullable: true })
  salesrep?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'rider_id', type: 'int', nullable: true })
  riderId?: number;

  @Column({ name: 'assigned_at', type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({ name: 'recepients_name', type: 'varchar', length: 255, nullable: true })
  recipientsName?: string;

  @Column({ name: 'recepients_contact', type: 'varchar', length: 255, nullable: true })
  recipientsContact?: string;

  @Column({ name: 'dispatched_by', type: 'int', nullable: true })
  dispatchedBy?: number;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled', 'in payment', 'paid'],
    default: 'draft'
  })
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'in payment' | 'paid';

  @Column({ name: 'my_status', type: 'tinyint' })
  myStatus: number;

  @Column({ name: 'received_into_stock', type: 'tinyint', default: 0 })
  receivedIntoStock: boolean;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ name: 'delivery_notes', type: 'varchar', length: 255 })
  deliveryNotes: string;

  @Column({ name: 'received_by', type: 'int' })
  receivedBy: number;

  @Column({ name: 'received_at', type: 'datetime', nullable: true })
  receivedAt?: Date;

  @Column({ name: 'delivery_image', type: 'varchar', length: 500, nullable: true })
  deliveryImage?: string;

  @Column({ name: 'returned_at', type: 'datetime', nullable: true })
  returnedAt?: Date;

  // Virtual fields for client information (will be populated via joins)
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}
