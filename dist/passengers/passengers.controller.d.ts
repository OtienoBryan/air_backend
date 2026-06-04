import { PassengersService } from './passengers.service';
import { Passenger } from '../entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengersController {
    private readonly passengersService;
    constructor(passengersService: PassengersService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        passengers: Passenger[];
        total: number;
    }>;
    findOne(id: number): Promise<Passenger>;
    create(createPassengerDto: CreatePassengerDto): Promise<Passenger>;
    update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
