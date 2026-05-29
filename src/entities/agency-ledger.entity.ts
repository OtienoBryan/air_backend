import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Agency } from './agency.entity';

@Entity('agency_ledger')
export class AgencyLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agency_id' })
  agencyId: number;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'debit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column({ name: 'credit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number;

  @Column({ name: 'balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'reference', type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Agency, agency => agency.id)
  @JoinColumn({ name: 'agency_id' })
  agency: Agency;
}

