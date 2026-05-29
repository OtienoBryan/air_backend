import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Notice } from './notice.entity';

@Entity('Country')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'int', default: 0, nullable: true })
  status: number; // 0 = inactive, 1 = active

  @OneToMany(() => Notice, notice => notice.country)
  notices?: Notice[];
}
