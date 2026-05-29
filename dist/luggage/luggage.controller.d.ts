import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';
export declare class LuggageController {
    private readonly luggageService;
    constructor(luggageService: LuggageService);
    create(createLuggageDto: CreateLuggageDto): Promise<Luggage>;
    findAllWithDetails(flightSeriesId?: string): Promise<any[]>;
    findAllByPassenger(passengerId: number): Promise<Luggage[]>;
    findOne(id: number): Promise<Luggage>;
    update(id: number, updateLuggageDto: UpdateLuggageDto): Promise<Luggage>;
    remove(id: number): Promise<{
        message: string;
    }>;
    removeAllByPassenger(passengerId: number): Promise<{
        message: string;
    }>;
}
