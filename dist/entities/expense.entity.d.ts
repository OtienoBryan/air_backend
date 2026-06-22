import { JournalEntry } from './journal-entry.entity';
import { Supplier } from './supplier.entity';
import { ExpenseType } from './expense-type.entity';
import { FlightRoute } from './flight-route.entity';
import { Aircraft } from './aircraft.entity';
import { Flight } from './flight.entity';
export declare class Expense {
    id: number;
    journal_entry_id: number;
    supplier_id: number | null;
    expense_type_id: number | null;
    expense_type?: ExpenseType | null;
    amount_paid: number;
    balance: number;
    linked_to: string | null;
    route_id: number | null;
    aircraft_id: number | null;
    flight_id: number | null;
    cost_center: string | null;
    posted_by: number | null;
    journal_entry?: JournalEntry;
    supplier?: Supplier;
    route?: FlightRoute | null;
    aircraft?: Aircraft | null;
    flight?: Flight | null;
    created_at: Date;
}
