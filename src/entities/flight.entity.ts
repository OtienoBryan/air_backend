import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Aircraft } from './aircraft.entity';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'series_id', type: 'int' })
  series_id: number;

  @ManyToOne(() => FlightSeries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'series_id' })
  series?: FlightSeries;

  @Column({ name: 'aircraft_id', type: 'int', nullable: true })
  aircraft_id: number | null;

  @ManyToOne(() => Aircraft, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'aircraft_id' })
  aircraft?: Aircraft | null;

  @Column({ name: 'aircraft_capacity', type: 'int', nullable: true })
  aircraft_capacity: number | null;

  @Column({ name: 'flight_no', type: 'varchar', length: 50 })
  flight_no: string;

  @Column({ name: 'flight_date', type: 'date' })
  flight_date: string;

  @Column({ name: 'std', type: 'time', nullable: true })
  std: string | null;

  @Column({ name: 'sta', type: 'time', nullable: true })
  sta: string | null;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'scheduled' })
  status: string; // scheduled | delayed | cancelled | completed

  @Column({ name: 'is_extra', type: 'tinyint', width: 1, default: 0 })
  is_extra: boolean;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
