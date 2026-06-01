import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
export declare class BookingPassenger {
    id: number;
    booking_id: number;
    booking?: Booking;
    flight_series_id: number | null;
    flightSeries?: FlightSeries;
    passenger_id: number;
    passenger?: Passenger;
    passenger_type: string;
    fare_amount: number;
    travel_date: string | null;
    leg: string;
    ticket_status: string | null;
    created_at: Date;
}
