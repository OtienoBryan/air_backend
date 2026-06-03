import { Repository } from 'typeorm';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { CreateCargoBookingDto } from './dto/create-cargo-booking.dto';
export declare class CargoBookingsService {
    private cargoBookingRepository;
    private flightSeriesRepository;
    constructor(cargoBookingRepository: Repository<CargoBooking>, flightSeriesRepository: Repository<FlightSeries>);
    create(dto: CreateCargoBookingDto): Promise<CargoBooking>;
    findAll(page?: number, limit?: number, flightSeriesId?: number): Promise<{
        cargoBookings: CargoBooking[];
        total: number;
    }>;
    findOne(id: number): Promise<CargoBooking>;
    assignFlight(id: number, flightSeriesId: number | null): Promise<CargoBooking>;
    recordPayment(id: number, data: {
        amount_paid: number;
        payment_reference?: string;
        payment_account?: string;
        payment_account_id?: number | null;
        payment_date: string;
        payment_status?: string;
        payment_confirmed_by?: string;
    }): Promise<CargoBooking>;
}
