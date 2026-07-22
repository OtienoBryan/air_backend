import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passenger } from './passenger.entity';

@Entity('passenger_travel_documents')
export class PassengerTravelDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'document_type', type: 'varchar', length: 30, nullable: true })
  document_type: string | null; // 'national_id' | 'passport' | 'travel_document'

  @Column({ name: 'document_number', type: 'varchar', length: 100, nullable: true })
  document_number: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ name: 'issuing_country', type: 'varchar', length: 100, nullable: true })
  issuing_country: string | null;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issue_date: string | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiry_date: string | null;

  @Column({ name: 'document_scan_url', type: 'varchar', length: 500, nullable: true })
  document_scan_url: string | null;

  @Column({ name: 'document_scan_public_id', type: 'varchar', length: 255, nullable: true })
  document_scan_public_id: string | null;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by: number | null;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
