import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cargo_handling_fees')
export class CargoHandlingFee {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 100 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) amount: number;
  @Column({ type: 'varchar', length: 10, default: 'USD' }) currency: string;
  @Column({ name: 'fee_type', type: 'varchar', length: 20, default: 'per_shipment' }) fee_type: string; // per_shipment | per_kg | per_piece
  @Column({ name: 'is_active', type: 'tinyint', default: 1 }) is_active: boolean;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
}
