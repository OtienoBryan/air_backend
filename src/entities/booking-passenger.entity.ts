import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
import { Flight } from './flight.entity';

@Entity('booking_passengers')
@Unique(['booking_id', 'passenger_id', 'leg'])
export class BookingPassenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'booking_id', type: 'int' })
  booking_id: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Column({ name: 'flight_series_id', type: 'int', nullable: true })
  flight_series_id: number | null;

  @ManyToOne(() => FlightSeries, { nullable: true })
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @ManyToOne(() => Flight, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight | null;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'passenger_type', type: 'varchar', length: 20 })
  passenger_type: string; // 'adult' | 'child' | 'infant'

  @Column({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2 })
  fare_amount: number;

  @Column({ name: 'travel_date', type: 'date', nullable: true })
  travel_date: string | null;

  @Column({ name: 'leg', type: 'varchar', length: 20, default: 'outbound' })
  leg: string; // 'outbound' | 'return'

  @Column({ name: 'return_travel_date', type: 'date', nullable: true })
  return_travel_date: string | null;

  @Column({ name: 'return_flight_series_id', type: 'int', nullable: true })
  return_flight_series_id: number | null;

  @Column({ name: 'status', type: 'varchar', length: 30, nullable: true, default: 'confirmed' })
  status: string | null;

  @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
  checked_in_at: Date | null;

  @Column({ name: 'boarded_at', type: 'timestamp', nullable: true })
  boarded_at: Date | null;

  @Column({ name: 'checkin_by', type: 'int', nullable: true })
  checkin_by: number | null;

  @Column({ name: 'ticket_number', type: 'varchar', length: 20, nullable: true, unique: true })
  ticket_number: string | null;

  @Column({
    name: 'ticket_status',
    type: 'enum',
    enum: ['OPEN', 'USED', 'VOID', 'REFUNDED'],
    nullable: true,
    default: 'OPEN',
  })
  ticket_status: 'OPEN' | 'USED' | 'VOID' | 'REFUNDED' | null;

  @Column({ name: 'issued_at', type: 'timestamp', nullable: true })
  issued_at: Date | null;

  @Column({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true })
  payment_reference: string | null;

  @Column({ name: 'payment_account', type: 'varchar', length: 100, nullable: true })
  payment_account: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
