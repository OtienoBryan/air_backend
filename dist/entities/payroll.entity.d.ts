import { Staff } from './staff.entity';
import { JournalEntry } from './journal-entry.entity';
export declare class Payroll {
    id: number;
    journal_entry_id: number;
    staff_id: number;
    payroll_date: Date;
    amount: number;
    description: string | null;
    reference: string | null;
    created_at: Date;
    journal_entry?: JournalEntry;
    staff?: Staff;
}
