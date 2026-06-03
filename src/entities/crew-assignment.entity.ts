import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Flight } from './flight.entity';
import { Crew } from './crew.entity';

@Entity('crew_assignments')
@Unique(['flight_id', 'crew_id'])
export class CrewAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'flight_id', type: 'int' })
  flight_id: number;

  @ManyToOne(() => Flight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight;

  @Column({ name: 'crew_id', type: 'int' })
  crew_id: number;

  @ManyToOne(() => Crew, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crew_id' })
  crew?: Crew;

  @Column({ name: 'role', type: 'varchar', length: 100, nullable: true })
  role: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
