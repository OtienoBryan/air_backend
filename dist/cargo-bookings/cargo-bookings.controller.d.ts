import { CargoBookingsService } from './cargo-bookings.service';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { CreateCargoBookingDto } from './dto/create-cargo-booking.dto';
import { AssignCargoFlightDto } from './dto/assign-cargo-flight.dto';
export declare class CargoBookingsController {
    private readonly cargoBookingsService;
    constructor(cargoBookingsService: CargoBookingsService);
    create(dto: CreateCargoBookingDto): Promise<CargoBooking>;
    findAll(page?: number, limit?: number, flightSeriesId?: string): Promise<{
        cargoBookings: CargoBooking[];
        total: number;
    }>;
    assignFlight(id: number, dto: AssignCargoFlightDto): Promise<CargoBooking>;
}
