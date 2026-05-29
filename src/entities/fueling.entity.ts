import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FlightSeries } from './flight-series.entity';
import { Supplier } from './supplier.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('fueling')
export class Fueling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'flight_series_id', type: 'int' })
  flight_series_id: number;

  @ManyToOne(() => FlightSeries)
  @JoinColumn({ name: 'flight_series_id' })
  flightSeries?: FlightSeries;

  @Column({ name: 'supplier_id', type: 'int' })
  supplier_id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @Column({ name: 'fuel_quantity', type: 'decimal', precision: 10, scale: 2 })
  fuel_quantity: number;

  @Column({ name: 'fuel_slip_number', type: 'varchar', length: 100 })
  fuel_slip_number: string;

  @Column({ name: 'price_per_liter', type: 'decimal', precision: 10, scale: 2 })
  price_per_liter: number;

  @Column({ name: 'location', type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'additional_fees', type: 'decimal', precision: 10, scale: 2, default: 0 })
  additional_fees: number;

  @Column({ name: 'additional_fees_explanation', type: 'varchar', length: 500, nullable: true })
  additional_fees_explanation: string | null;

  @Column({ name: 'tax', type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @Column({ name: 'fueling_date', type: 'date' })
  fueling_date: Date;

  @Column({ name: 'journal_entry_id', type: 'int', nullable: true })
  journal_entry_id: number | null;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journal_entry?: JournalEntry;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
