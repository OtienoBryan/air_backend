import { CountriesService } from './countries.service';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<import("../entities").Country[]>;
    findOne(id: number): Promise<import("../entities").Country | null>;
    findByName(name: string): Promise<import("../entities").Country | null>;
}
export declare class AdminCountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<import("../entities").Country[]>;
    create(body: {
        name: string;
        status: number;
        tax_percentage?: number | null;
    }): Promise<import("../entities").Country>;
    update(id: number, body: {
        name?: string;
        status?: number;
        tax_percentage?: number | null;
    }): Promise<import("../entities").Country>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getTaxAccounts(): Promise<import("../entities").ChartOfAccount[]>;
    getTaxes(id: number): Promise<import("../entities/country-tax.entity").CountryTax[]>;
    addTax(id: number, body: {
        account_id: number;
        amount: number;
        currency: string;
    }): Promise<import("../entities/country-tax.entity").CountryTax>;
    updateTax(id: number, taxId: number, body: {
        account_id?: number;
        amount?: number;
        currency?: string;
    }): Promise<import("../entities/country-tax.entity").CountryTax>;
    removeTax(id: number, taxId: number): Promise<{
        message: string;
    }>;
}
