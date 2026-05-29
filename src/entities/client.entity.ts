import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 191 })
  name: string;

  @Column({ name: 'password', type: 'varchar', length: 119, nullable: true })
  password?: string;

  @Column({ name: 'address', type: 'varchar', length: 191, nullable: true })
  address?: string;

  @Column({ name: 'latitude', type: 'double', nullable: true })
  latitude?: number;

  @Column({ name: 'longitude', type: 'double', nullable: true })
  longitude?: number;

  @Column({ name: 'balance', type: 'decimal', precision: 11, scale: 2, nullable: true })
  balance?: number;

  @Column({ name: 'email', type: 'varchar', length: 191, nullable: true })
  email?: string;

  @Column({ name: 'region_id', type: 'int' })
  regionId: number;

  @Column({ name: 'region', type: 'varchar', length: 191 })
  region: string;

  @Column({ name: 'route_id', type: 'int', nullable: true })
  routeId?: number;

  @Column({ name: 'route_name', type: 'varchar', length: 191, nullable: true })
  routeName?: string;

  @Column({ name: 'route_id_update', type: 'int', nullable: true })
  routeIdUpdate?: number;

  @Column({ name: 'route_name_update', type: 'varchar', length: 100, nullable: true })
  routeNameUpdate?: string;

  @Column({ name: 'contact', type: 'varchar', length: 191 })
  contact: string;
}