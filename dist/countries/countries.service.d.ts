import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { CountryTax } from '../entities/country-tax.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
export declare class CountriesService {
    private countryRepository;
    private countryTaxRepository;
    private chartOfAccountRepository;
    private cache;
    private readonly CACHE_TTL;
    constructor(countryRepository: Repository<Country>, countryTaxRepository: Repository<CountryTax>, chartOfAccountRepository: Repository<ChartOfAccount>);
    private getFromCache;
    private setCache;
    findAll(): Promise<Country[]>;
    findOne(id: number): Promise<Country | null>;
    findByName(name: string): Promise<Country | null>;
    findAllAdmin(): Promise<Country[]>;
    create(data: {
        name: string;
        status: number;
        tax_percentage?: number | null;
    }): Promise<Country>;
    update(id: number, data: {
        name?: string;
        status?: number;
        tax_percentage?: number | null;
    }): Promise<Country>;
    remove(id: number): Promise<void>;
    getTaxes(countryId: number): Promise<CountryTax[]>;
    addTax(countryId: number, data: {
        account_id: number;
        amount: number;
        currency: string;
    }): Promise<CountryTax>;
    updateTax(countryId: number, taxId: number, data: {
        account_id?: number;
        amount?: number;
        currency?: string;
    }): Promise<CountryTax>;
    removeTax(countryId: number, taxId: number): Promise<void>;
    getTaxAccounts(): Promise<ChartOfAccount[]>;
}
