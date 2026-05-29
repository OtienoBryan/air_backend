import { JournalEntry } from './journal-entry.entity';
import { Supplier } from './supplier.entity';
export declare class Expense {
    id: number;
    journal_entry_id: number;
    supplier_id: number | null;
    amount_paid: number;
    balance: number;
    journal_entry?: JournalEntry;
    supplier?: Supplier;
    created_at: Date;
}
