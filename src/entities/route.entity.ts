import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  region: number;

  @Column({ type: 'varchar', length: 100 })
  region_name: string;

  @Column({ type: 'int' })
  country_id: number;

  @Column({ type: 'varchar', length: 100 })
  country_name: string;

  @Column({ type: 'int' })
  sales_rep_id: number;

  @Column({ type: 'varchar', length: 100 })
  sales_rep_name: string;

  @Column({ type: 'int' })
  leader_id: number;

  @Column({ type: 'varchar', length: 20 })
  leader_name: string;

  @Column({ type: 'int' })
  status: number; // 0 = inactive, 1 = active
}
