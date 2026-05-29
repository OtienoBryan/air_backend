import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Passenger } from './passenger.entity';
import { Agent } from './agent.entity';

@Entity('seat_reservations')
export class SeatReservation {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

