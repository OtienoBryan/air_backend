import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FlightSeries } from './flight-series.entity';

@Entity('cargo_bookings')
export class CargoBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'awb_number', type: 'varchar', length: 20, unique: true })
  awb_number: string;

  @Column({ name: 'flight_series_id', type: 'int', nullable: true })
  flight_series_id: number | null;

  @ManyToOne(() => FlightSeries, { nullable: true })
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries | null;

  @Column({ name: 'origin', type: 'varchar', length: 3 })
  origin: string;

  @Column({ name: 'destination', type: 'varchar', length: 3 })
  destination: string;

  @Column({ name: 'shipper_name', type: 'varchar', length: 255 })
  shipper_name: string;

  // Use shipper_phone (not shipper_contact) to match live DB schema
  @Column({ name: 'shipper_phone', type: 'varchar', length: 50, nullable: true })
  shipper_phone: string | null;

  @Column({ name: 'shipper_address', type: 'text', nullable: true })
  shipper_address: string | null;

  @Column({ name: 'consignee_name', type: 'varchar', length: 255 })
  consignee_name: string;

  @Column({ name: 'consignee_phone', type: 'varchar', length: 50, nullable: true })
  consignee_phone: string | null;

  @Column({ name: 'consignee_address', type: 'text', nullable: true })
  consignee_address: string | null;

  @Column({ name: 'commodity_type', type: 'varchar', length: 100 })
  commodity_type: string;

  @Column({ name: 'special_handling_codes', type: 'varchar', length: 100, nullable: true })
  special_handling_codes: string | null;

  @Column({ name: 'pieces', type: 'int' })
  pieces: number;

  @Column({ name: 'gross_weight_kg', type: 'decimal', precision: 10, scale: 2 })
  gross_weight_kg: number;

  @Column({ name: 'chargeable_weight_kg', type: 'decimal', precision: 10, scale: 2 })
  chargeable_weight_kg: number;

  @Column({ name: 'volume_cbm', type: 'decimal', precision: 10, scale: 3, nullable: true })
  volume_cbm: number | null;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'payment_term', type: 'varchar', length: 10, default: 'PREPAID' })
  payment_term: string;

  @Column({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rate_per_kg: number | null;

  @Column({ name: 'total_charges', type: 'decimal', precision: 15, scale: 2, default: 0.0 })
  total_charges: number;

  @Column({ name: 'booking_date', type: 'date' })
  booking_date: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'booked' })
  status: string;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'unpaid', nullable: true })
  payment_status: string | null;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, default: 0, nullable: true })
  amount_paid: number | null;

  @Column({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true })
  payment_reference: string | null;

  @Column({ name: 'payment_account', type: 'varchar', length: 150, nullable: true })
  payment_account: string | null;

  @Column({ name: 'payment_account_id', type: 'int', nullable: true })
  payment_account_id: number | null;

  @Column({ name: 'payment_date', type: 'date', nullable: true })
  payment_date: string | null;

  @Column({ name: 'payment_confirmed_by', type: 'varchar', length: 150, nullable: true })
  payment_confirmed_by: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

