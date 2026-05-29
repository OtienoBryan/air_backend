import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Aircraft } from './aircraft.entity';
import { Destination } from './destination.entity';
import { FlightCrew } from './flight-crew.entity';

@Entity('flight_series')
export class FlightSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  flt: string; // Flight number

  @Column({ name: 'aircraft_id', type: 'int', nullable: true })
  aircraft_id: number | null;

  @ManyToOne(() => Aircraft)
  @JoinColumn({ name: 'aircraft_id' })
  aircraft?: Aircraft;

  @Column({ name: 'flight_type', type: 'varchar', length: 50 })
  flight_type: string; // From-To, From-Via_To, MultiLeg

  @Column({ name: 'start_date', type: 'date' })
  start_date: Date;

  @Column({ name: 'end_date', type: 'date' })
  end_date: Date;

  @Column({ name: 'std', type: 'time', nullable: true })
  std: string | null; // Scheduled Time of Departure

  @Column({ name: 'sta', type: 'time', nullable: true })
  sta: string | null; // Scheduled Time of Arrival

  @Column({ name: 'number_of_seats', type: 'int', nullable: true })
  number_of_seats: number | null;

  // From-To fields
  @Column({ name: 'from_destination_id', type: 'int', nullable: true })
  from_destination_id: number | null;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'from_destination_id' })
  fromDestination?: Destination;

  @Column({ name: 'from_terminal', type: 'varchar', length: 100, nullable: true })
  from_terminal: string | null;

  @Column({ name: 'to_terminal', type: 'varchar', length: 100, nullable: true })
  to_terminal: string | null;

  // From-Via_To fields
  @Column({ name: 'via_destination_id', type: 'int', nullable: true })
  via_destination_id: number | null;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'via_destination_id' })
  viaDestination?: Destination;

  @Column({ name: 'via_std', type: 'time', nullable: true })
  via_std: string | null;

  @Column({ name: 'via_sta', type: 'time', nullable: true })
  via_sta: string | null;

  @Column({ name: 'to_destination_id', type: 'int', nullable: true })
  to_destination_id: number | null;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'to_destination_id' })
  toDestination?: Destination;

  @Column({ name: 'adult_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adult_fare: number | null;

  @Column({ name: 'child_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  child_fare: number | null;

  @Column({ name: 'infant_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  infant_fare: number | null;

  @OneToMany(() => FlightCrew, flightCrew => flightCrew.flightSeries)
  flightCrew?: FlightCrew[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

