import { FlightSeriesService } from './flight-series.service';
import { FlightSeries } from '../entities/flight-series.entity';
import { CreateFlightSeriesDto } from './dto/create-flight-series.dto';
import { UpdateFlightSeriesDto } from './dto/update-flight-series.dto';
export declare class FlightSeriesController {
    private readonly flightSeriesService;
    constructor(flightSeriesService: FlightSeriesService);
    findAll(page?: number, limit?: number): Promise<{
        flightSeries: FlightSeries[];
        total: number;
    }>;
    findOne(id: number): Promise<FlightSeries>;
    create(createFlightSeriesDto: CreateFlightSeriesDto): Promise<FlightSeries>;
    update(id: number, updateFlightSeriesDto: UpdateFlightSeriesDto): Promise<FlightSeries>;
    remove(id: number): Promise<{
        message: string;
    }>;
    assignCrew(id: number, crewId: number): Promise<{
        message: string;
    }>;
    removeCrew(id: number, crewId: number): Promise<{
        message: string;
    }>;
    getCrewAssignments(id: number): Promise<import("../entities").FlightCrew[]>;
    getFlightInstances(id: number, from?: string, to?: string): Promise<import("../entities/flight.entity").Flight[]>;
    regenerateFlightInstances(id: number): Promise<{
        message: string;
        count: number;
    }>;
}
