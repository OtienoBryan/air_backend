import { Repository } from 'typeorm';
import { Luggage } from '../entities/luggage.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { Booking } from '../entities/booking.entity';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';
export declare class LuggageService {
    private luggageRepository;
    private bookingPassengerRepository;
    private bookingRepository;
    constructor(luggageRepository: Repository<Luggage>, bookingPassengerRepository: Repository<BookingPassenger>, bookingRepository: Repository<Booking>);
    create(createLuggageDto: CreateLuggageDto): Promise<Luggage>;
    findAllByPassenger(passengerId: number): Promise<Luggage[]>;
    findOne(id: number): Promise<Luggage>;
    update(id: number, updateLuggageDto: UpdateLuggageDto, updatedBy?: number | null): Promise<Luggage>;
    remove(id: number): Promise<void>;
    removeAllByPassenger(passengerId: number): Promise<void>;
    findAllWithDetails(flightSeriesId?: number): Promise<any[]>;
}
