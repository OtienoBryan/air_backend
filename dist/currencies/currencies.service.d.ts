import { Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';
export declare class CurrenciesService {
    private currencyRepository;
    constructor(currencyRepository: Repository<Currency>);
    findAll(): Promise<Currency[]>;
    findOne(id: number): Promise<Currency>;
    create(data: Partial<Currency>): Promise<Currency>;
    update(id: number, data: Partial<Currency>): Promise<Currency>;
    setDefault(id: number): Promise<Currency>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
