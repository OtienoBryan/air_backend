import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('SalesRep')
export class SalesRep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ type: 'varchar', length: 191 })
  email: string;

  @Column({ type: 'varchar', length: 191 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 191 })
  password: string;

  @Column({ type: 'int' })
  countryId: number;

  @Column({ type: 'varchar', length: 191 })
  country: string;

  @Column({ type: 'int' })
  region_id: number;

  @Column({ type: 'varchar', length: 191 })
  region: string;

  @Column({ type: 'int' })
  route_id: number;

  @Column({ type: 'varchar', length: 100 })
  route: string;

  @Column({ type: 'int' })
  route_id_update: number;

  @Column({ type: 'varchar', length: 100 })
  route_name_update: string;

  @Column({ type: 'int', width: 3 })
  visits_targets: number;

  @Column({ type: 'int', width: 3 })
  new_clients: number;

  @Column({ type: 'int' })
  vapes_targets: number;

  @Column({ type: 'int' })
  pouches_targets: number;

  @Column({ type: 'varchar', length: 191, nullable: true, default: 'USER' })
  role: string;

  @Column({ type: 'int' })
  manager_type: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  status: number;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  createdAt: Date;
}
