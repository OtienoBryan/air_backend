import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountType } from './account-type.entity';

@Entity('chart_of_accounts')
export class ChartOfAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'account_code', type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'account_type', type: 'int' })
  account_type: number;

  @ManyToOne(() => AccountType)
  @JoinColumn({ name: 'account_type' })
  accountType?: AccountType;

  @Column({ name: 'fare', type: 'tinyint', default: 0 })
  fare: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
