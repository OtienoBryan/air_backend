import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
import { Booking } from './booking.entity';
export declare class Luggage {
    id: number;
    passenger_id: number;
    passenger?: Passenger;
    flight_series_id: number | null;
    flightSeries?: FlightSeries | null;
    booking_id: number | null;
    booking?: Booking | null;
    tag_number: string | null;
    weight: number | null;
    created_at: Date;
    updated_at: Date;
}
