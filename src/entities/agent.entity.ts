import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agency } from './agency.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact: string | null;

  @Column({ name: 'agency_id', type: 'int', nullable: true })
  agency_id: number | null;

  @ManyToOne(() => Agency, { nullable: true })
  @JoinColumn({ name: 'agency_id' })
  agency?: Agency | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  password_hash: string | null;

  @Column({ name: 'use_deposit', type: 'boolean', default: false })
  use_deposit: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

