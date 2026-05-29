import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('payroll')
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'journal_entry_id', type: 'int' })
  journal_entry_id: number;

  @Column({ name: 'staff_id', type: 'int' })
  staff_id: number;

  @Column({ name: 'payroll_date', type: 'date' })
  payroll_date: Date;

  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ name: 'reference', type: 'varchar', length: 100, nullable: true })
  reference: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journal_entry?: JournalEntry;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staff_id' })
  staff?: Staff;
}
