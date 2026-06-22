import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { Supplier } from './supplier.entity';
import { ExpenseType } from './expense-type.entity';
import { FlightRoute } from './flight-route.entity';
import { Aircraft } from './aircraft.entity';
import { Flight } from './flight.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'journal_entry_id', type: 'int' })
  journal_entry_id: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplier_id: number | null;

  @Column({ name: 'expense_type_id', type: 'int', nullable: true })
  expense_type_id: number | null;

  @ManyToOne(() => ExpenseType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'expense_type_id' })
  expense_type?: ExpenseType | null;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  amount_paid: number;

  @Column({ name: 'balance', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  balance: number;

  // Expense linkage
  @Column({ name: 'linked_to', type: 'varchar', length: 20, nullable: true })
  linked_to: string | null; // 'route' | 'aircraft' | 'flight' | 'cost_center'

  @Column({ name: 'route_id', type: 'int', nullable: true })
  route_id: number | null;

  @Column({ name: 'aircraft_id', type: 'int', nullable: true })
  aircraft_id: number | null;

  @Column({ name: 'flight_id', type: 'int', nullable: true })
  flight_id: number | null;

  @Column({ name: 'cost_center', type: 'varchar', length: 100, nullable: true })
  cost_center: string | null;

  @Column({ name: 'posted_by', type: 'int', nullable: true })
  posted_by: number | null;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journal_entry?: JournalEntry;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @ManyToOne(() => FlightRoute, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'route_id' })
  route?: FlightRoute | null;

  @ManyToOne(() => Aircraft, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'aircraft_id' })
  aircraft?: Aircraft | null;

  @ManyToOne(() => Flight, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'flight_id' })
  flight?: Flight | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
