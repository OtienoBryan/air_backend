import { SalesRepsService } from './sales-reps.service';
import { SalesRep } from '../entities/sales-rep.entity';
import { Region } from '../entities/region.entity';
import { Route } from '../entities/route.entity';
export declare class SalesRepsController {
    private readonly salesRepsService;
    constructor(salesRepsService: SalesRepsService);
    findAll(): Promise<SalesRep[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byCountry: Record<string, number>;
        byRegion: Record<string, number>;
    }>;
    getCountries(): Promise<import("../entities").Country[]>;
    getRegions(countryId?: string): Promise<Region[]>;
    getRoutes(regionId?: string): Promise<Route[]>;
    findOne(id: number): Promise<SalesRep>;
    create(salesRepData: Partial<SalesRep>): Promise<SalesRep>;
    update(id: number, salesRepData: Partial<SalesRep>): Promise<SalesRep>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
