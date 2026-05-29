import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { Supplier } from './supplier.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'journal_entry_id', type: 'int' })
  journal_entry_id: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplier_id: number | null;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  amount_paid: number;

  @Column({ name: 'balance', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  balance: number;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journal_entry?: JournalEntry;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
