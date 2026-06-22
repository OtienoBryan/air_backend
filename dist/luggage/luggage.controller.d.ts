import { Repository } from 'typeorm';
import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';
export declare class LuggageController {
    private readonly luggageService;
    private readonly excessChargeRepository;
    constructor(luggageService: LuggageService, excessChargeRepository: Repository<LuggageExcessCharge>);
    create(createLuggageDto: CreateLuggageDto): Promise<Luggage>;
    findAllWithDetails(flightSeriesId?: string): Promise<any[]>;
    findAllByPassenger(passengerId: number): Promise<Luggage[]>;
    findOne(id: number): Promise<Luggage>;
    update(id: number, updateLuggageDto: UpdateLuggageDto, req: any): Promise<Luggage>;
    remove(id: number): Promise<{
        message: string;
    }>;
    removeAllByPassenger(passengerId: number): Promise<{
        message: string;
    }>;
    postExcessCharge(body: {
        passenger_id: number;
        booking_id?: number | null;
        flight_id?: number | null;
        flight_series_id?: number | null;
        route_id?: number | null;
        total_weight: number;
        weight_limit: number;
        excess_kg: number;
        charge_per_kg: number;
        total_charge: number;
        currency?: string;
        notes?: string | null;
    }): Promise<LuggageExcessCharge>;
    getExcessCharges(flightId?: string, passengerId?: string): Promise<LuggageExcessCharge[]>;
    deleteExcessCharge(id: number): Promise<{
        message: string;
    }>;
}
