import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ChartOfAccount } from './chart-of-account.entity';

@Entity('account_types')
export class AccountType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_type', type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => ChartOfAccount, chartOfAccount => chartOfAccount.accountType)
  chartOfAccounts?: ChartOfAccount[];
}
