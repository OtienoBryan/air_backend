import { FlightSeries } from './flight-series.entity';
import { Supplier } from './supplier.entity';
import { JournalEntry } from './journal-entry.entity';
export declare class Fueling {
    id: number;
    flight_series_id: number;
    flightSeries?: FlightSeries;
    supplier_id: number;
    supplier?: Supplier;
    fuel_quantity: number;
    fuel_slip_number: string;
    price_per_liter: number;
    location: string;
    additional_fees: number;
    additional_fees_explanation: string | null;
    tax: number;
    total_amount: number;
    fueling_date: Date;
    journal_entry_id: number | null;
    journal_entry?: JournalEntry;
    created_at: Date;
    updated_at: Date;
}
