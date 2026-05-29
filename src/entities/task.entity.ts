import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SalesRep } from './sales-rep.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  createdAt: Date;

  @Column({ type: 'datetime', precision: 3, nullable: true })
  completedAt: Date | null;

  @Column({ type: 'tinyint', default: 0 })
  isCompleted: boolean;

  @Column({ type: 'varchar', length: 191, default: 'medium' })
  priority: string;

  @Column({ type: 'varchar', length: 191, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true, name: 'salesRepId' })
  salesRepId: string; // JSON string of sales rep IDs for multiple assignments

  @Column({ type: 'int', nullable: true })
  assignedById: number;

  @Column({ type: 'varchar', length: 20 })
  date: string;

  // Virtual field to get sales reps as objects (for multiple sales reps)
  salesReps?: SalesRep[];

  @ManyToOne(() => SalesRep, { nullable: true })
  @JoinColumn({ name: 'assignedById' })
  assignedBy: SalesRep;
}
