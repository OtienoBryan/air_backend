import { Repository } from 'typeorm';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { FlightCrew } from '../entities/flight-crew.entity';
import { Crew } from '../entities/crew.entity';
import { CreateFlightSeriesDto } from './dto/create-flight-series.dto';
import { UpdateFlightSeriesDto } from './dto/update-flight-series.dto';
export declare class FlightSeriesService {
    private flightSeriesRepository;
    private flightRepository;
    private aircraftRepository;
    private flightCrewRepository;
    private crewRepository;
    constructor(flightSeriesRepository: Repository<FlightSeries>, flightRepository: Repository<Flight>, aircraftRepository: Repository<Aircraft>, flightCrewRepository: Repository<FlightCrew>, crewRepository: Repository<Crew>);
    private toDateStr;
    generateFlightInstances(series: FlightSeries): Promise<number>;
    findAll(page?: number, limit?: number): Promise<{
        flightSeries: FlightSeries[];
        total: number;
    }>;
    findOne(id: number): Promise<FlightSeries>;
    create(createFlightSeriesDto: CreateFlightSeriesDto): Promise<FlightSeries>;
    update(id: number, updateFlightSeriesDto: UpdateFlightSeriesDto): Promise<FlightSeries>;
    remove(id: number): Promise<void>;
    assignCrew(flightSeriesId: number, crewId: number): Promise<FlightCrew>;
    removeCrew(flightSeriesId: number, crewId: number): Promise<void>;
    getCrewAssignments(flightSeriesId: number): Promise<FlightCrew[]>;
    getFlightInstances(seriesId: number, from?: string, to?: string): Promise<Flight[]>;
    regenerateFlightInstances(seriesId: number): Promise<number>;
}
