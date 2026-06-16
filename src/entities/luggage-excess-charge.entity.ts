import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passenger } from './passenger.entity';
import { FlightRoute } from './flight-route.entity';

@Entity('luggage_excess_charges')
export class LuggageExcessCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'booking_id', type: 'int', nullable: true })
  booking_id: number | null;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @Column({ name: 'flight_series_id', type: 'int', nullable: true })
  flight_series_id: number | null;

  @Column({ name: 'route_id', type: 'int', nullable: true })
  route_id: number | null;

  @ManyToOne(() => FlightRoute, { nullable: true })
  @JoinColumn({ name: 'route_id' })
  route?: FlightRoute | null;

  @Column({ name: 'total_weight', type: 'decimal', precision: 8, scale: 2, default: 0 })
  total_weight: number;

  @Column({ name: 'weight_limit', type: 'decimal', precision: 6, scale: 2, default: 0 })
  weight_limit: number;

  @Column({ name: 'excess_kg', type: 'decimal', precision: 6, scale: 2, default: 0 })
  excess_kg: number;

  @Column({ name: 'charge_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 })
  charge_per_kg: number;

  @Column({ name: 'total_charge', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_charge: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
