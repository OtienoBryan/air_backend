import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity('client_ledger')
export class ClientLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

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

  @ManyToOne(() => Client, client => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
