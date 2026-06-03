import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('exception_types')
export class ExceptionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  notification: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
