import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_code', type: 'varchar', length: 20 })
  store_code: string;

  @Column({ name: 'store_name', type: 'varchar', length: 100 })
  store_name: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'country_id', type: 'int' })
  country_id: number;

  @Column({ name: 'is_active', type: 'boolean', nullable: true })
  is_active: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
