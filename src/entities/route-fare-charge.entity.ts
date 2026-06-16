import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FlightRoute } from './flight-route.entity';
import { ChartOfAccount } from './chart-of-account.entity';

@Entity('route_fare_charges')
export class RouteFareCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'route_id', type: 'int' })
  route_id: number;

  @ManyToOne(() => FlightRoute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route?: FlightRoute;

  @Column({ name: 'account_id', type: 'int' })
  account_id: number;

  @ManyToOne(() => ChartOfAccount)
  @JoinColumn({ name: 'account_id' })
  account?: ChartOfAccount;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  label: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
