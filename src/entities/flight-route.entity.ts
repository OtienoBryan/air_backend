import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Destination } from './destination.entity';

@Entity('flight_routes')
export class FlightRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'from_destination_id', type: 'int' })
  from_destination_id: number;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'from_destination_id' })
  fromDestination?: Destination;

  @Column({ name: 'to_destination_id', type: 'int' })
  to_destination_id: number;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'to_destination_id' })
  toDestination?: Destination;

  // Optional via/transit stop — when set, the route is origin → via → destination,
  // and the leg fares below price each segment independently of the direct fare.
  @Column({ name: 'via_destination_id', type: 'int', nullable: true })
  via_destination_id: number | null;

  @ManyToOne(() => Destination, { nullable: true })
  @JoinColumn({ name: 'via_destination_id' })
  viaDestination?: Destination | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_fare: number | null;

  // Leg 1: Origin → Via
  @Column({ name: 'adult_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_fare_origin_via: number | null;

  @Column({ name: 'child_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_fare_origin_via: number | null;

  @Column({ name: 'infant_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_fare_origin_via: number | null;

  // Leg 2: Via → Destination
  @Column({ name: 'adult_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_fare_via_destination: number | null;

  @Column({ name: 'child_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_fare_via_destination: number | null;

  @Column({ name: 'infant_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_fare_via_destination: number | null;

  // Currency for every fare field on this route (direct, both legs, and return)
  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  // Return fares for Leg 1: Origin → Via
  @Column({ name: 'adult_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_return_fare_origin_via: number | null;

  @Column({ name: 'child_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_return_fare_origin_via: number | null;

  @Column({ name: 'infant_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_return_fare_origin_via: number | null;

  // Return fares for Leg 2: Via → Destination
  @Column({ name: 'adult_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_return_fare_via_destination: number | null;

  @Column({ name: 'child_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_return_fare_via_destination: number | null;

  @Column({ name: 'infant_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_return_fare_via_destination: number | null;

  @Column({ name: 'adult_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_return_fare: number | null;

  @Column({ name: 'child_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_return_fare: number | null;

  @Column({ name: 'infant_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_return_fare: number | null;

  @Column({ name: 'fare_valid_from', type: 'date', nullable: true })
  fare_valid_from: string | null;

  @Column({ name: 'fare_valid_to', type: 'date', nullable: true })
  fare_valid_to: string | null;

  @Column({ name: 'route_type', type: 'varchar', length: 20, default: 'domestic' })
  route_type: string; // 'domestic' | 'international'

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
