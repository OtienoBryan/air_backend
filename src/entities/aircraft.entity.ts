import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Staff } from './staff.entity';

@Entity('aircrafts')
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  registration: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ name: 'max_cargo_weight', type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_cargo_weight: number;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdByStaff?: Staff;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'calendar_color', type: 'varchar', length: 7, nullable: true, default: '#3B82F6' })
  calendar_color: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

