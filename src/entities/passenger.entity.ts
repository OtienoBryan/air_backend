import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('passengers')
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  pnr: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  id_type: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  identification: string | null;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  title: string | null; // Mr., Mrs., Ms., Dr., etc.

  @Column({ type: 'varchar', length: 50, nullable: true })
  booking_status: string | null; // 'Boarded', 'CHECK IN', 'No Show'

  // For child/infant passengers added under an adult — the adult passenger's id
  @Column({ name: 'guardian_passenger_id', type: 'int', nullable: true })
  guardian_passenger_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

