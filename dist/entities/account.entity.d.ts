import { AccountLedger } from './account-ledger.entity';
export declare class Account {
    id: number;
    name: string;
    code: string;
    currency: string | null;
    balance: number;
    status: string;
    ledgerEntries?: AccountLedger[];
    created_at: Date;
    updated_at: Date;
}
