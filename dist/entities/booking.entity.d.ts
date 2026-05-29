import { FlightSeries } from './flight-series.entity';
import { Passenger } from './passenger.entity';
import { BookingPassenger } from './booking-passenger.entity';
export declare class Booking {
    id: number;
    booking_reference: string;
    flight_series_id: number;
    flightSeries?: FlightSeries;
    passenger_id: number | null;
    passenger?: Passenger;
    bookingPassengers?: BookingPassenger[];
    passenger_name: string;
    passenger_email: string | null;
    passenger_phone: string | null;
    passenger_type: string;
    number_of_passengers: number;
    fare_per_passenger: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    booking_date: Date;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}
