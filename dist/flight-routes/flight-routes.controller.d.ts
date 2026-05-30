import { FlightRoutesService } from './flight-routes.service';
export declare class FlightRoutesController {
    private readonly flightRoutesService;
    constructor(flightRoutesService: FlightRoutesService);
    findAll(): Promise<import("../entities/flight-route.entity").FlightRoute[]>;
    findOne(id: number): Promise<import("../entities/flight-route.entity").FlightRoute>;
    create(body: {
        from_destination_id: number;
        to_destination_id: number;
        adult_fare?: number | null;
        child_fare?: number | null;
        infant_fare?: number | null;
        status?: string;
    }): Promise<import("../entities/flight-route.entity").FlightRoute>;
    update(id: number, body: {
        from_destination_id?: number;
        to_destination_id?: number;
        adult_fare?: number | null;
        child_fare?: number | null;
        infant_fare?: number | null;
        status?: string;
    }): Promise<import("../entities/flight-route.entity").FlightRoute>;
    getFareHistory(id: number): Promise<import("../entities/fare-history.entity").FareHistory[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
