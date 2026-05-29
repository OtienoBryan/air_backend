import { Repository } from 'typeorm';
import { Aircraft } from '../entities/aircraft.entity';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
export declare class AircraftsService {
    private aircraftRepository;
    constructor(aircraftRepository: Repository<Aircraft>);
    findAll(page?: number, limit?: number): Promise<{
        aircrafts: Aircraft[];
        total: number;
    }>;
    findOne(id: number): Promise<Aircraft>;
    create(createAircraftDto: CreateAircraftDto): Promise<Aircraft>;
    update(id: number, updateAircraftDto: UpdateAircraftDto): Promise<Aircraft>;
    remove(id: number): Promise<void>;
}
