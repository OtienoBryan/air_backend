import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'country_id', type: 'int' })
  countryId: number;

  @ManyToOne(() => Country, country => country.notices, { eager: false })
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0 = inactive, 1 = active
}
