import { FlightRoute } from './flight-route.entity';
export declare class FareHistory {
    id: number;
    route_id: number;
    route?: FlightRoute;
    adult_fare: number | null;
    child_fare: number | null;
    infant_fare: number | null;
    adult_return_fare: number | null;
    child_return_fare: number | null;
    infant_return_fare: number | null;
    fare_valid_from: string | null;
    fare_valid_to: string | null;
    changed_at: Date;
}
