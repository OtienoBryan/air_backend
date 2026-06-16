import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Country } from './country.entity';
import { ChartOfAccount } from './chart-of-account.entity';

@Entity('country_taxes')
export class CountryTax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'country_id', type: 'int' })
  country_id: number;

  @ManyToOne(() => Country, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @Column({ name: 'account_id', type: 'int' })
  account_id: number;

  @ManyToOne(() => ChartOfAccount)
  @JoinColumn({ name: 'account_id' })
  account?: ChartOfAccount;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
