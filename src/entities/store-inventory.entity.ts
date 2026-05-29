import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('store_inventory')
export class StoreInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_id', type: 'int' })
  store_id: number;

  @Column({ name: 'product_id', type: 'int' })
  product_id: number;

  @Column({ name: 'quantity', type: 'int', nullable: true, default: 0 })
  quantity: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
