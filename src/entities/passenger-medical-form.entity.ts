import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Passenger } from './passenger.entity';

@Entity('passenger_medical_forms')
export class PassengerMedicalForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'passenger_id', type: 'int' })
  passenger_id: number;

  @ManyToOne(() => Passenger)
  @JoinColumn({ name: 'passenger_id' })
  passenger?: Passenger;

  @Column({ name: 'booking_id', type: 'int', nullable: true })
  booking_id: number | null;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @Column({ name: 'flight_series_id', type: 'int', nullable: true })
  flight_series_id: number | null;

  @Column({ name: 'medical_condition', type: 'text', nullable: true })
  medical_condition: string | null;

  @Column({ name: 'doctor_name', type: 'varchar', length: 150, nullable: true })
  doctor_name: string | null;

  @Column({ name: 'hospital_name', type: 'varchar', length: 150, nullable: true })
  hospital_name: string | null;

  @Column({ name: 'date_submitted', type: 'date', nullable: true })
  date_submitted: string | null;

  @Column({ name: 'review_status', type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  review_status: 'pending' | 'approved' | 'rejected';

  @Column({ name: 'medical_clearance_expiry_date', type: 'date', nullable: true })
  medical_clearance_expiry_date: string | null;

  @Column({ name: 'ssr_codes', type: 'varchar', length: 255, nullable: true })
  ssr_codes: string | null;

  @Column({ name: 'oxygen_required', type: 'tinyint', width: 1, default: 0 })
  oxygen_required: boolean;

  @Column({ name: 'wheelchair_required', type: 'enum', enum: ['none', 'WCHR', 'WCHS', 'WCHC'], default: 'none' })
  wheelchair_required: 'none' | 'WCHR' | 'WCHS' | 'WCHC';

  @Column({ name: 'stretcher_required', type: 'tinyint', width: 1, default: 0 })
  stretcher_required: boolean;

  @Column({ name: 'medical_escort_required', type: 'tinyint', width: 1, default: 0 })
  medical_escort_required: boolean;

  @Column({ name: 'medical_officer_comments', type: 'text', nullable: true })
  medical_officer_comments: string | null;

  @Column({ name: 'approval_date', type: 'date', nullable: true })
  approval_date: string | null;

  // JSON-encoded array of { url, name, public_id }
  @Column({ name: 'attached_documents', type: 'text', nullable: true })
  attached_documents: string | null;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by: number | null;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
