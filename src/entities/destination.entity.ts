import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'icao_code', type: 'varchar', length: 10, nullable: true })
  icao_code: string | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'country_id', type: 'int', nullable: true })
  country_id: number | null;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timezone: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'father_code', type: 'varchar', length: 50, nullable: true })
  father_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  destination: string; // Airport/Airstrip name

  @Column({ name: 'destination_type', type: 'varchar', length: 20, default: 'domestic' })
  destination_type: string; // 'domestic' | 'international'

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

