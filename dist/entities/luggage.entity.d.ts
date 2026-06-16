import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
import { Booking } from './booking.entity';
export declare class Luggage {
    id: number;
    passenger_id: number;
    passenger?: Passenger;
    flight_series_id: number | null;
    flightSeries?: FlightSeries | null;
    flight_id: number | null;
    booking_id: number | null;
    booking?: Booking | null;
    booking_reference: string | null;
    staff_id: number | null;
    tag_number: string | null;
    weight: number | null;
    excess_kg: number;
    excess_charge: number;
    created_at: Date;
    updated_at: Date;
}
