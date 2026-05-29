import { ChartOfAccount } from './chart-of-account.entity';
export declare class AccountType {
    id: number;
    name: string;
    created_at: Date;
    chartOfAccounts?: ChartOfAccount[];
}
