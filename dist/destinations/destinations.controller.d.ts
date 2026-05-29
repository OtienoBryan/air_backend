import { DestinationsService } from './destinations.service';
import { Destination } from '../entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
export declare class DestinationsController {
    private readonly destinationsService;
    constructor(destinationsService: DestinationsService);
    findAll(page?: number, limit?: number): Promise<{
        destinations: Destination[];
        total: number;
    }>;
    findOne(id: number): Promise<Destination>;
    create(createDestinationDto: CreateDestinationDto): Promise<Destination>;
    update(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
