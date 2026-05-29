import { Staff } from './staff.entity';
import { JournalEntryLine } from './journal-entry-line.entity';
import { Expense } from './expense.entity';
export declare class JournalEntry {
    id: number;
    entry_number: string;
    entry_date: Date;
    reference: string | null;
    description: string | null;
    total_debit: number;
    total_credit: number;
    status: 'draft' | 'posted' | 'cancelled';
    created_by: number;
    creator?: Staff;
    lines?: JournalEntryLine[];
    expenses?: Expense[];
    created_at: Date;
    updated_at: Date;
}
