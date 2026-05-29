import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Regions')
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'int' })
  countryId: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  status: number; // 0 = inactive, 1 = active
}
