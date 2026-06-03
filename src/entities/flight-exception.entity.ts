import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flight } from './flight.entity';
import { ExceptionType } from './exception-type.entity';

@Entity('flight_exceptions')
export class FlightException {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'flight_id', type: 'int' })
  flight_id: number;

  @ManyToOne(() => Flight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight;

  @Column({ name: 'exception_type', type: 'int' })
  exception_type: number;

  @ManyToOne(() => ExceptionType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'exception_type' })
  exceptionType?: ExceptionType;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'old_value', type: 'varchar', length: 255, nullable: true })
  old_value: string | null;

  @Column({ name: 'new_value', type: 'varchar', length: 255, nullable: true })
  new_value: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: true })
  created_by: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
