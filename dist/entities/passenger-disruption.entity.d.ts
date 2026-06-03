import { Booking } from './booking.entity';
import { Flight } from './flight.entity';
export declare class PassengerDisruption {
    id: number;
    booking_id: number;
    booking?: Booking;
    flight_id: number;
    flight?: Flight;
    disruption_type: string;
    action_taken: string | null;
    created_at: Date;
}
