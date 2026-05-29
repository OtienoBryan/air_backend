import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { Country } from '../entities/country.entity';
import { Region } from '../entities/region.entity';
import { Route } from '../entities/route.entity';
export declare class SalesRepsService {
    private salesRepRepository;
    private countryRepository;
    private regionRepository;
    private routeRepository;
    constructor(salesRepRepository: Repository<SalesRep>, countryRepository: Repository<Country>, regionRepository: Repository<Region>, routeRepository: Repository<Route>);
    findAll(): Promise<SalesRep[]>;
    findOne(id: number): Promise<SalesRep | null>;
    create(salesRepData: Partial<SalesRep>): Promise<SalesRep>;
    update(id: number, salesRepData: Partial<SalesRep>): Promise<SalesRep>;
    remove(id: number): Promise<void>;
    getSalesRepStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byCountry: Record<string, number>;
        byRegion: Record<string, number>;
    }>;
    getCountries(): Promise<Country[]>;
    getRegions(countryId?: number): Promise<Region[]>;
    getRoutes(regionId?: number): Promise<Route[]>;
}
