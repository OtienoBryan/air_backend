import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Mapped to chart_of_accounts — the accounts table does not exist in this installation.
@Entity('chart_of_accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'account_code', type: 'varchar', length: 50, unique: true })
  code: string;

  // chart_of_accounts does not have currency/balance/status — exposed as null for compatibility
  currency: string | null = null;
  balance: number = 0;
  status: string = 'active';

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

