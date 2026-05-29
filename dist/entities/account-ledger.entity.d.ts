import { Account } from './account.entity';
export declare class AccountLedger {
    id: number;
    account_id: number;
    account?: Account;
    transactionDate: Date;
    description: string | null;
    debit: number;
    credit: number;
    balance: number;
    reference: string | null;
    payment_method: string | null;
    createdAt: Date;
}
