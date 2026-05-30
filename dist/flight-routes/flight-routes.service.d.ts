import { Repository } from 'typeorm';
import { FlightRoute } from '../entities/flight-route.entity';
import { FareHistory } from '../entities/fare-history.entity';
export declare class FlightRoutesService {
    private routeRepository;
    private fareHistoryRepository;
    constructor(routeRepository: Repository<FlightRoute>, fareHistoryRepository: Repository<FareHistory>);
    findAll(): Promise<FlightRoute[]>;
    findOne(id: number): Promise<FlightRoute>;
    create(data: Partial<FlightRoute>): Promise<FlightRoute>;
    update(id: number, data: Partial<FlightRoute>): Promise<FlightRoute>;
    getFareHistory(routeId: number): Promise<FareHistory[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
