import { FlightSeries } from './flight-series.entity';
import { Passenger } from './passenger.entity';
import { Agent } from './agent.entity';
export declare class SeatReservation {
    id: number;
    flight_series_id: number;
    flightSeries?: FlightSeries;
    passenger_id: number | null;
    passenger?: Passenger;
    number_of_seats: number;
    passenger_name: string;
    passenger_email: string | null;
    passenger_phone: string | null;
    booking_reference: string;
    status: string;
    reservation_date: Date;
    notes: string | null;
    agent_id: number | null;
    agent?: Agent | null;
    created_at: Date;
    updated_at: Date;
}
