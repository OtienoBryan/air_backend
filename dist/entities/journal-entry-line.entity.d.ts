import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccount } from './chart-of-account.entity';
export declare class JournalEntryLine {
    id: number;
    journal_entry_id: number;
    journal_entry?: JournalEntry;
    account_id: number;
    account?: ChartOfAccount;
    debit_amount: number;
    credit_amount: number;
    description: string | null;
}
