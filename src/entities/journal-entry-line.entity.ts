import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccount } from './chart-of-account.entity';

@Entity('journal_entry_lines')
export class JournalEntryLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'journal_entry_id', type: 'int' })
  journal_entry_id: number;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journal_entry?: JournalEntry;

  @Column({ name: 'account_id', type: 'int' })
  account_id: number;

  @ManyToOne(() => ChartOfAccount)
  @JoinColumn({ name: 'account_id' })
  account?: ChartOfAccount;

  @Column({ name: 'debit_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  debit_amount: number;

  @Column({ name: 'credit_amount', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  credit_amount: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
