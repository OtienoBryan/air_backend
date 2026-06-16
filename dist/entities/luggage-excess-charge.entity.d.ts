import { Passenger } from './passenger.entity';
import { FlightRoute } from './flight-route.entity';
export declare class LuggageExcessCharge {
    id: number;
    passenger_id: number;
    passenger?: Passenger;
    booking_id: number | null;
    flight_id: number | null;
    flight_series_id: number | null;
    route_id: number | null;
    route?: FlightRoute | null;
    total_weight: number;
    weight_limit: number;
    excess_kg: number;
    charge_per_kg: number;
    total_charge: number;
    currency: string;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}
