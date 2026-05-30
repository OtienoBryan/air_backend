import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { FlightRoute } from './flight-route.entity';

@Entity('fare_history')
export class FareHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'route_id', type: 'int' })
  route_id: number;

  @ManyToOne(() => FlightRoute)
  @JoinColumn({ name: 'route_id' })
  route?: FlightRoute;

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

  @CreateDateColumn({ name: 'changed_at' })
  changed_at: Date;
}
