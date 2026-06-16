import { Country } from './country.entity';
import { ChartOfAccount } from './chart-of-account.entity';
export declare class CountryTax {
    id: number;
    country_id: number;
    country?: Country;
    account_id: number;
    account?: ChartOfAccount;
    amount: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}
