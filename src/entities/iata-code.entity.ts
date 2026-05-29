import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('iata_codes')
export class IataCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 3, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 4, nullable: true })
    icao: string;

    @Column({ type: 'varchar', length: 255 })
    airport: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 2 })
    country_code: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region_name: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitude: number;

    @Column({ type: 'varchar', length: 50, default: 'active' })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
