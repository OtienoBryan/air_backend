import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cargo_freight_rates')
export class CargoFreightRate {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 10, nullable: true }) origin: string | null;
  @Column({ type: 'varchar', length: 10, nullable: true }) destination: string | null;
  @Column({ name: 'min_weight_kg', type: 'decimal', precision: 10, scale: 2, default: 0 }) min_weight_kg: number;
  @Column({ name: 'max_weight_kg', type: 'decimal', precision: 10, scale: 2, nullable: true }) max_weight_kg: number | null;
  @Column({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 4, default: 0 }) rate_per_kg: number;
  @Column({ type: 'varchar', length: 10, default: 'USD' }) currency: string;
  @Column({ name: 'is_active', type: 'tinyint', default: 1 }) is_active: boolean;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
}
