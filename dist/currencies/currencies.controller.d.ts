import { CurrenciesService } from './currencies.service';
export declare class CurrenciesController {
    private readonly currenciesService;
    constructor(currenciesService: CurrenciesService);
    findAll(): Promise<import("../entities").Currency[]>;
    findOne(id: number): Promise<import("../entities").Currency>;
    create(body: {
        name: string;
        country: string;
        symbol: string;
        code?: string;
        status?: string;
    }): Promise<import("../entities").Currency>;
    update(id: number, body: {
        name?: string;
        country?: string;
        symbol?: string;
        code?: string;
        status?: string;
    }): Promise<import("../entities").Currency>;
    setDefault(id: number): Promise<import("../entities").Currency>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
