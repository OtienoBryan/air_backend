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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_fare: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_fare: number | null;

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
