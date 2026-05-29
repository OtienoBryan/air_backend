import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_code', type: 'varchar', length: 20 })
  product_code: string;

  @Column({ name: 'product_name', type: 'varchar', length: 100 })
  product_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ name: 'category', type: 'varchar', length: 50, nullable: true })
  category: string;

  @Column({ name: 'unit_of_measure', type: 'varchar', length: 20, nullable: true })
  unit_of_measure: string;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_price: number;

  @Column({ name: 'selling_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  selling_price: number;

  @Column({ name: 'tax_type', type: 'enum', enum: ['16%', 'zero_rated', 'exempted'], nullable: true })
  tax_type: string;

  @Column({ name: 'reorder_level', type: 'int', nullable: true })
  reorder_level: number;

  @Column({ name: 'current_stock', type: 'int', nullable: true })
  current_stock: number;

  @Column({ name: 'is_active', type: 'boolean', nullable: true })
  is_active: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column({ name: 'image_url', type: 'varchar', length: 200, nullable: true })
  image_url: string;
}
