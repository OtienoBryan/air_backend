import { FlightSeries } from './flight-series.entity';
import { Aircraft } from './aircraft.entity';
export declare class Flight {
    id: number;
    series_id: number;
    series?: FlightSeries;
    aircraft_id: number | null;
    aircraft?: Aircraft | null;
    aircraft_capacity: number | null;
    flight_no: string;
    flight_date: string;
    std: string | null;
    sta: string | null;
    status: string;
    is_extra: boolean;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}
