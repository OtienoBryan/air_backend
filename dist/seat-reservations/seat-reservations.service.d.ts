import { Repository } from 'typeorm';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { CreateSeatReservationDto } from './dto/create-seat-reservation.dto';
import { UpdateSeatReservationDto } from './dto/update-seat-reservation.dto';
export declare class SeatReservationsService {
    private seatReservationRepository;
    private flightSeriesRepository;
    private passengerRepository;
    constructor(seatReservationRepository: Repository<SeatReservation>, flightSeriesRepository: Repository<FlightSeries>, passengerRepository: Repository<Passenger>);
    findAll(page?: number, limit?: number, flightSeriesId?: number): Promise<{
        reservations: SeatReservation[];
        total: number;
    }>;
    findOne(id: number): Promise<SeatReservation>;
    findByFlightSeries(flightSeriesId: number): Promise<SeatReservation[]>;
    create(createSeatReservationDto: CreateSeatReservationDto): Promise<SeatReservation>;
    update(id: number, updateSeatReservationDto: UpdateSeatReservationDto): Promise<SeatReservation>;
    remove(id: number): Promise<void>;
    private generateBookingReference;
    private generatePNR;
}
