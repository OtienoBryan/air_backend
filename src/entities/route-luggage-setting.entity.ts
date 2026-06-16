import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FlightRoute } from './flight-route.entity';

@Entity('route_luggage_settings')
export class RouteLuggageSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'route_id', type: 'int' })
  route_id: number;

  @ManyToOne(() => FlightRoute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route?: FlightRoute;

  @Column({ type: 'varchar', length: 50, default: 'Checked Baggage' })
  type: string;

  @Column({ name: 'weight_limit', type: 'decimal', precision: 6, scale: 2, default: 0 })
  weight_limit: number;

  @Column({ name: 'extra_charge_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 })
  extra_charge_per_kg: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
