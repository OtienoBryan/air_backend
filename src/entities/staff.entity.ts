import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  photo_url: string;

  @Column({ type: 'varchar', length: 50 })
  empl_no: string;

  @Column({ type: 'varchar', length: 50 })
  id_no: string;

  @Column({ type: 'varchar', length: 255 })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  designation: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'int', nullable: true })
  department_id: number;

  @ManyToOne(() => Department, department => department.staff)
  @JoinColumn({ name: 'department_id' })
  department_relation?: Department;

  @Column({ type: 'varchar', length: 255, nullable: true })
  business_email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department_email: string;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'varchar', length: 100 })
  employment_type: string;

  @Column({ 
    type: 'enum', 
    enum: ['Male', 'Female', 'Other'] 
  })
  gender: 'Male' | 'Female' | 'Other';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', default: 1 })
  is_active: number;

  @Column({ type: 'varchar', length: 200 })
  avatar_url: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  // Chat rooms relationship removed to avoid circular dependency
  // chatRooms?: ChatRoom[];
}