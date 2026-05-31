import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ name: 'booking_limit', type: 'int', nullable: true })
  booking_limit: number | null;

  @Column({ name: 'credit_limit', type: 'decimal', precision: 10, scale: 2, nullable: true })
  credit_limit: number | null;

  @Column({ name: 'max_pax_per_booking', type: 'int', nullable: true })
  max_pax_per_booking: number | null;

  @Column({ name: 'default_currency', type: 'varchar', length: 3, nullable: true })
  default_currency: string | null;

  @Column({ name: 'credit_days', type: 'int', nullable: true })
  credit_days: number | null;

  @Column({ name: 'payment_limit', type: 'decimal', precision: 10, scale: 2, nullable: true })
  payment_limit: number | null;

  @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'commission_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commission_percentage: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

