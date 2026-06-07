import { SeatReservationsService } from './seat-reservations.service';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { CreateSeatReservationDto } from './dto/create-seat-reservation.dto';
import { UpdateSeatReservationDto } from './dto/update-seat-reservation.dto';
export declare class SeatReservationsController {
    private readonly seatReservationsService;
    constructor(seatReservationsService: SeatReservationsService);
    findAll(page?: string, limit?: string, flightSeriesId?: string, agentId?: string, status?: string): Promise<{
        reservations: SeatReservation[];
        total: number;
    }>;
    findByFlightSeries(flightSeriesId: number): Promise<SeatReservation[]>;
    findOne(id: number): Promise<SeatReservation>;
    create(createSeatReservationDto: CreateSeatReservationDto): Promise<SeatReservation>;
    update(id: number, updateSeatReservationDto: UpdateSeatReservationDto): Promise<SeatReservation>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
