import { CountriesService } from './countries.service';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<import("../entities").Country[]>;
    findOne(id: number): Promise<import("../entities").Country | null>;
    findByName(name: string): Promise<import("../entities").Country | null>;
}
