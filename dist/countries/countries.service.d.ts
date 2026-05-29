import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
export declare class CountriesService {
    private countryRepository;
    private cache;
    private readonly CACHE_TTL;
    constructor(countryRepository: Repository<Country>);
    private getFromCache;
    private setCache;
    findAll(): Promise<Country[]>;
    findOne(id: number): Promise<Country | null>;
    findByName(name: string): Promise<Country | null>;
}
