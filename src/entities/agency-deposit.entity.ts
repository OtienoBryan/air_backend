import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Agency } from './agency.entity';
import { Account } from './account.entity';

@Entity('agency_deposits')
export class AgencyDeposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agency_id', type: 'int' })
  agencyId: number;

  @Column({ name: 'account_id', type: 'int' })
  accountId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'date_paid', type: 'date' })
  datePaid: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 100 })
  reference: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Agency)
  @JoinColumn({ name: 'agency_id' })
  agency?: Agency;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account?: Account;
}

