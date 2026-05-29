import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Country } from '../entities/country.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
export declare class DestinationsService {
    private destinationRepository;
    private countryRepository;
    constructor(destinationRepository: Repository<Destination>, countryRepository: Repository<Country>);
    findAll(page?: number, limit?: number): Promise<{
        destinations: Destination[];
        total: number;
    }>;
    findOne(id: number): Promise<Destination>;
    create(createDestinationDto: CreateDestinationDto): Promise<Destination>;
    update(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination>;
    remove(id: number): Promise<void>;
}
