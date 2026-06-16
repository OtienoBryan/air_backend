import { FlightRoute } from './flight-route.entity';
export declare class RouteLuggageSetting {
    id: number;
    route_id: number;
    route?: FlightRoute;
    type: string;
    weight_limit: number;
    extra_charge_per_kg: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}
