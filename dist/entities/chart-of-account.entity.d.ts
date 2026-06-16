import { AccountType } from './account-type.entity';
export declare class ChartOfAccount {
    id: number;
    name: string;
    code: string;
    account_type: number;
    accountType?: AccountType;
    fare: number;
    created_at: Date;
    updated_at: Date;
}
