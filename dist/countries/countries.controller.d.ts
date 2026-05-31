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
}
