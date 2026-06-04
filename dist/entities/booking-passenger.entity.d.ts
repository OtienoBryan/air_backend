import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';
import { FlightSeries } from './flight-series.entity';
import { Flight } from './flight.entity';
export declare class BookingPassenger {
    id: number;
    booking_id: number;
    booking?: Booking;
    flight_series_id: number | null;
    flightSeries?: FlightSeries;
    flight_id: number | null;
    flight?: Flight | null;
    passenger_id: number;
    passenger?: Passenger;
    passenger_type: string;
    fare_amount: number;
    travel_date: string | null;
    leg: string;
    return_travel_date: string | null;
    return_flight_series_id: number | null;
    status: string | null;
    ticket_number: string | null;
    ticket_status: 'OPEN' | 'USED' | 'VOID' | 'REFUNDED' | null;
    issued_at: Date | null;
    payment_reference: string | null;
    payment_account: string | null;
    created_at: Date;
}
