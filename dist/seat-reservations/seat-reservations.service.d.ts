import { Repository } from 'typeorm';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { Passenger } from '../entities/passenger.entity';
import { Country } from '../entities/country.entity';
import { CreateSeatReservationDto } from './dto/create-seat-reservation.dto';
import { UpdateSeatReservationDto } from './dto/update-seat-reservation.dto';
export declare class SeatReservationsService {
    private seatReservationRepository;
    private flightSeriesRepository;
    private flightRepository;
    private passengerRepository;
    private countryRepository;
    constructor(seatReservationRepository: Repository<SeatReservation>, flightSeriesRepository: Repository<FlightSeries>, flightRepository: Repository<Flight>, passengerRepository: Repository<Passenger>, countryRepository: Repository<Country>);
    findAll(page?: number, limit?: number, flightSeriesId?: number, agentId?: number, status?: string): Promise<{
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
