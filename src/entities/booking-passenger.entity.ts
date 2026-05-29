import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';

@Entity('booking_passengers')
@Unique(['booking_id', 'passenger_id'])
export class BookingPassenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'booking_id', type: 'int' })
  booking_id: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'passenger_type', type: 'varchar', length: 20 })
  passenger_type: string; // 'adult', 'child', 'infant'

  @Column({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2 })
  fare_amount: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

