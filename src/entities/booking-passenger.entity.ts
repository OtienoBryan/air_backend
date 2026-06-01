import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';

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

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'passenger_type', type: 'varchar', length: 20 })
  passenger_type: string; // 'adult', 'child', 'infant'

  @Column({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2 })
  fare_amount: number;

  @Column({ name: 'travel_date', type: 'date', nullable: true })
  travel_date: string | null;

  // 'outbound' or 'return' — each leg is a separate row
  @Column({ name: 'leg', type: 'varchar', length: 20, default: 'outbound' })
  leg: string;

  // Ticket check-in / boarding status: 'Boarded' | 'CHECK IN' | 'No Show' | null
  @Column({ name: 'ticket_status', type: 'varchar', length: 50, nullable: true })
  ticket_status: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
