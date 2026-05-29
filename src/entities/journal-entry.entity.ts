import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Staff } from './staff.entity';
import { JournalEntryLine } from './journal-entry-line.entity';
import { Expense } from './expense.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'entry_number', type: 'varchar', length: 20, unique: true })
  entry_number: string;

  @Column({ name: 'entry_date', type: 'date' })
  entry_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'total_debit', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  total_debit: number;

  @Column({ name: 'total_credit', type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  total_credit: number;

  @Column({ 
    type: 'enum', 
    enum: ['draft', 'posted', 'cancelled'],
    default: 'draft'
  })
  status: 'draft' | 'posted' | 'cancelled';

  @Column({ name: 'created_by', type: 'int' })
  created_by: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  creator?: Staff;

  @OneToMany(() => JournalEntryLine, line => line.journal_entry)
  lines?: JournalEntryLine[];

  @OneToMany(() => Expense, expense => expense.journal_entry)
  expenses?: Expense[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
