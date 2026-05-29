import { Booking } from './booking.entity';
import { Passenger } from './passenger.entity';
export declare class BookingPassenger {
    id: number;
    booking_id: number;
    booking?: Booking;
    passenger_id: number;
    passenger?: Passenger;
    passenger_type: string;
    fare_amount: number;
    created_at: Date;
}
