import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cargo_shc_charges')
export class CargoShcCharge {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 10 }) code: string;
  @Column({ type: 'varchar', length: 255, nullable: true }) description: string | null;
  @Column({ name: 'charge_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }) charge_amount: number;
  @Column({ type: 'varchar', length: 10, default: 'USD' }) currency: string;
  @Column({ name: 'charge_type', type: 'varchar', length: 20, default: 'flat' }) charge_type: string; // flat | per_kg
  @Column({ name: 'is_active', type: 'tinyint', default: 1 }) is_active: boolean;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
}
