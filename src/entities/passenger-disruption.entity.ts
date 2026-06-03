import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Flight } from './flight.entity';

@Entity('passenger_disruptions')
export class PassengerDisruption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'booking_id', type: 'int' })
  booking_id: number;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Column({ name: 'flight_id', type: 'int' })
  flight_id: number;

  @ManyToOne(() => Flight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight;

  @Column({ name: 'disruption_type', type: 'varchar', length: 100 })
  disruption_type: string;

  @Column({ name: 'action_taken', type: 'varchar', length: 255, nullable: true })
  action_taken: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
