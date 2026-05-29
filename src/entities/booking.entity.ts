import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Passenger } from './passenger.entity';
import { BookingPassenger } from './booking-passenger.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'booking_reference', type: 'varchar', length: 50, unique: true })
  booking_reference: string;

  @Column({ name: 'flight_series_id', type: 'int' })
  flight_series_id: number;

  @ManyToOne(() => FlightSeries)
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries;

  @Column({ name: 'passenger_id', type: 'int', nullable: true })
  passenger_id: number | null;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @OneToMany(() => BookingPassenger, bookingPassenger => bookingPassenger.booking)
  bookingPassengers?: BookingPassenger[];

  @Column({ name: 'passenger_name', type: 'varchar', length: 255 })
  passenger_name: string;

  @Column({ name: 'passenger_email', type: 'varchar', length: 255, nullable: true })
  passenger_email: string | null;

  @Column({ name: 'passenger_phone', type: 'varchar', length: 50, nullable: true })
  passenger_phone: string | null;

  @Column({ name: 'passenger_type', type: 'varchar', length: 20 })
  passenger_type: string; // 'adult', 'child', 'infant'

  @Column({ name: 'number_of_passengers', type: 'int', default: 1 })
  number_of_passengers: number;

  @Column({ name: 'fare_per_passenger', type: 'decimal', precision: 10, scale: 2 })
  fare_per_passenger: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  payment_method: string; // 'cash', 'card', 'bank_transfer', 'online', etc.

  @Column({ name: 'payment_status', type: 'varchar', length: 50, default: 'pending' })
  payment_status: string; // 'pending', 'paid', 'failed', 'refunded'

  @Column({ name: 'booking_date', type: 'date' })
  booking_date: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

