import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Flight } from './flight.entity';
import { Passenger } from './passenger.entity';
import { Agent } from './agent.entity';
import { Country } from './country.entity';

@Entity('seat_reservations')
export class SeatReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'flight_series_id', type: 'int' })
  flight_series_id: number;

  @ManyToOne(() => FlightSeries)
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @ManyToOne(() => Flight, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight | null;

  @Column({ name: 'passenger_id', type: 'int', nullable: true })
  passenger_id: number | null;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'number_of_seats', type: 'int' })
  number_of_seats: number;

  @Column({ name: 'passenger_name', type: 'varchar', length: 255 })
  passenger_name: string;

  @Column({ name: 'passenger_email', type: 'varchar', length: 255, nullable: true })
  passenger_email: string | null;

  @Column({ name: 'passenger_phone', type: 'varchar', length: 50, nullable: true })
  passenger_phone: string | null;

  @Column({ name: 'booking_reference', type: 'varchar', length: 50, unique: true })
  booking_reference: string;

  @Column({ 
    name: 'status', 
    type: 'varchar', 
    length: 50, 
    default: 'reserved' 
  })
  status: string; // reserved, confirmed, cancelled, checked_in

  @Column({ name: 'reservation_date', type: 'date' })
  reservation_date: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'agent_id', type: 'int', nullable: true })
  agent_id: number | null;

  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent?: Agent | null;

  @Column({ name: 'country_id', type: 'int', nullable: true })
  country_id: number | null;

  @Column({ name: 'id_type', type: 'varchar', length: 30, nullable: true })
  id_type: string | null; // 'national_id' | 'passport' | 'travel_document'

  @Column({ name: 'id_number', type: 'varchar', length: 100, nullable: true })
  id_number: string | null;

  @Column({ name: 'id_expiry', type: 'date', nullable: true })
  id_expiry: string | null;

  @Column({ name: 'id_issued_by', type: 'varchar', length: 100, nullable: true })
  id_issued_by: string | null;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country?: Country | null;

  @Column({ name: 'trip_type', type: 'varchar', length: 20, default: 'one_way' })
  trip_type: string; // 'one_way' | 'return'

  @Column({ name: 'return_flight_series_id', type: 'int', nullable: true })
  return_flight_series_id: number | null;

  @Column({ name: 'return_date', type: 'date', nullable: true })
  return_date: string | null;

  @Column({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  fare_amount: number | null;

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'unpaid' })
  payment_status: string; // 'unpaid' | 'partial' | 'paid'

  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount_paid: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

