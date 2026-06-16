import { Repository } from 'typeorm';
import { FlightRoutesService } from './flight-routes.service';
import { FlightRoute } from '../entities/flight-route.entity';
import { RouteFareCharge } from '../entities/route-fare-charge.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { RouteLuggageSetting } from '../entities/route-luggage-setting.entity';
export declare class FlightRoutesController {
    private readonly flightRoutesService;
    private readonly fareChargeRepository;
    private readonly chartOfAccountRepository;
    private readonly luggageRepository;
    private readonly flightRouteRepository;
    constructor(flightRoutesService: FlightRoutesService, fareChargeRepository: Repository<RouteFareCharge>, chartOfAccountRepository: Repository<ChartOfAccount>, luggageRepository: Repository<RouteLuggageSetting>, flightRouteRepository: Repository<FlightRoute>);
    findAll(): Promise<FlightRoute[]>;
    getLuggageByDestinations(from: string, to: string): Promise<RouteLuggageSetting[]>;
    getFareAccounts(): Promise<ChartOfAccount[]>;
    findOne(id: number): Promise<FlightRoute>;
    create(body: {
        from_destination_id: number;
        to_destination_id: number;
        adult_fare?: number | null;
        child_fare?: number | null;
        infant_fare?: number | null;
        status?: string;
    }): Promise<FlightRoute>;
    update(id: number, body: {
        from_destination_id?: number;
        to_destination_id?: number;
        adult_fare?: number | null;
        child_fare?: number | null;
        infant_fare?: number | null;
        status?: string;
    }): Promise<FlightRoute>;
    getFareHistory(id: number): Promise<import("../entities/fare-history.entity").FareHistory[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getFareCharges(routeId: number): Promise<RouteFareCharge[]>;
    addFareCharge(routeId: number, body: {
        account_id: number;
        amount: number;
        currency?: string;
        label?: string;
    }): Promise<RouteFareCharge | null>;
    updateFareCharge(routeId: number, chargeId: number, body: {
        account_id?: number;
        amount?: number;
        currency?: string;
        label?: string;
    }): Promise<RouteFareCharge | null>;
    deleteFareCharge(routeId: number, chargeId: number): Promise<{
        message: string;
    }>;
    getLuggageSettings(routeId: number): Promise<RouteLuggageSetting[]>;
    addLuggageSetting(routeId: number, body: {
        type?: string;
        weight_limit: number;
        extra_charge_per_kg: number;
        currency?: string;
    }): Promise<RouteLuggageSetting>;
    updateLuggageSetting(routeId: number, settingId: number, body: {
        type?: string;
        weight_limit?: number;
        extra_charge_per_kg?: number;
        currency?: string;
    }): Promise<RouteLuggageSetting | null>;
    deleteLuggageSetting(routeId: number, settingId: number): Promise<{
        message: string;
    }>;
}
