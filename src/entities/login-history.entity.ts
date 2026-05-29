import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SalesRep } from './sales-rep.entity';

@Entity('LoginHistory')
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'varchar', length: 191, nullable: true, default: 'UTC' })
  timezone: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  status: number;

  @Column({ type: 'varchar', length: 191, nullable: true, comment: 'Session end datetime as stored in database (no timezone conversion)' })
  sessionEnd: string;

  @Column({ type: 'varchar', length: 191, nullable: true, comment: 'Session start datetime as stored in database (no timezone conversion)' })
  sessionStart: string;

  @ManyToOne(() => SalesRep, { eager: false })
  @JoinColumn({ name: 'userId' })
  salesRep?: SalesRep;
}
