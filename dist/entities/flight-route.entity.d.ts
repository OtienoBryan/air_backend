import { Destination } from './destination.entity';
export declare class FlightRoute {
    id: number;
    from_destination_id: number;
    fromDestination?: Destination;
    to_destination_id: number;
    toDestination?: Destination;
    adult_fare: number | null;
    child_fare: number | null;
    infant_fare: number | null;
    adult_return_fare: number | null;
    child_return_fare: number | null;
    infant_return_fare: number | null;
    fare_valid_from: string | null;
    fare_valid_to: string | null;
    route_type: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
