import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
import { Booking } from './booking.entity';

@Entity('luggage')
export class Luggage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'flight_series_id', type: 'int', nullable: true })
  flight_series_id: number | null;

  @ManyToOne(() => FlightSeries)
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries | null;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @Column({ name: 'booking_id', type: 'int', nullable: true })
  booking_id: number | null;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking | null;

  @Column({ name: 'booking_reference', type: 'varchar', length: 50, nullable: true })
  booking_reference: string | null;

  @Column({ name: 'staff_id', type: 'int', nullable: true })
  staff_id: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tag_number: string | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number | null;

  @Column({ name: 'excess_kg', type: 'decimal', precision: 6, scale: 2, default: 0 })
  excess_kg: number;

  @Column({ name: 'excess_charge', type: 'decimal', precision: 10, scale: 2, default: 0 })
  excess_charge: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

