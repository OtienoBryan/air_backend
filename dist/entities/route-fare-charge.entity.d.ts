import { FlightRoute } from './flight-route.entity';
import { ChartOfAccount } from './chart-of-account.entity';
export declare class RouteFareCharge {
    id: number;
    route_id: number;
    route?: FlightRoute;
    account_id: number;
    account?: ChartOfAccount;
    amount: number;
    currency: string;
    label: string | null;
    created_at: Date;
    updated_at: Date;
}
