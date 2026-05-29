import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('crew')
export class Crew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', length: 100 })
  role: string; // e.g., 'Pilot', 'Co-Pilot', 'Flight Engineer', etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ name: 'id_number', type: 'varchar', length: 50, nullable: true })
  id_number: string | null;

  // License Information
  @Column({ name: 'license_number', type: 'varchar', length: 50, nullable: true })
  license_number: string | null;

  @Column({ name: 'license_issue_date', type: 'date', nullable: true })
  license_issue_date: Date | null;

  // Medical Information
  @Column({ name: 'medical_class', type: 'varchar', length: 20, nullable: true })
  medical_class: string | null; // e.g., 'Class 1', 'Class 2', 'Class 3'

  @Column({ name: 'medical_date', type: 'date', nullable: true })
  medical_date: Date | null;

  // Training Information
  @Column({ name: 'fixed_wing_training_date', type: 'date', nullable: true })
  fixed_wing_training_date: Date | null;

  // Rotorcraft Training
  @Column({ name: 'rotorcraft_asel', type: 'date', nullable: true })
  rotorcraft_asel: Date | null; // Airplane Single Engine Land

  @Column({ name: 'rotorcraft_amel', type: 'date', nullable: true })
  rotorcraft_amel: Date | null; // Airplane Multi Engine Land

  @Column({ name: 'rotorcraft_ases', type: 'date', nullable: true })
  rotorcraft_ases: Date | null; // Airplane Single Engine Sea

  @Column({ name: 'rotorcraft_ames', type: 'date', nullable: true })
  rotorcraft_ames: Date | null; // Airplane Multi Engine Sea

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

