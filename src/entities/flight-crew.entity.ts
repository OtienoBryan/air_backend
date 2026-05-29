import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Crew } from './crew.entity';

@Entity('flight_crew')
@Unique(['flight_series_id', 'crew_id'])
export class FlightCrew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'flight_series_id', type: 'int' })
  flight_series_id: number;

  @ManyToOne(() => FlightSeries)
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries;

  @Column({ name: 'crew_id', type: 'int' })
  crew_id: number;

  @ManyToOne(() => Crew)
  @JoinColumn({ name: 'crew_id' })
  crew?: Crew;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

