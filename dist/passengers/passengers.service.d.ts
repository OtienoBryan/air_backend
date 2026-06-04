import { Repository } from 'typeorm';
import { Passenger } from '../entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
export declare class PassengersService {
    private passengerRepository;
    constructor(passengerRepository: Repository<Passenger>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        passengers: Passenger[];
        total: number;
    }>;
    findOne(id: number): Promise<Passenger>;
    create(createPassengerDto: CreatePassengerDto): Promise<Passenger>;
    update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger>;
    remove(id: number): Promise<void>;
    private generatePNR;
}
