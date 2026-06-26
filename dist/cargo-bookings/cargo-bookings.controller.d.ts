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
    updateStatus(id: number, body: {
        status: 'booked' | 'accepted' | 'manifested' | 'flown' | 'delivered' | 'cancelled';
    }): Promise<CargoBooking>;
    recordPayment(id: number, body: {
        amount_paid: number;
        payment_reference?: string;
        payment_account?: string;
        payment_account_id?: number | null;
        payment_date: string;
        payment_status?: string;
        payment_confirmed_by?: string;
    }): Promise<CargoBooking>;
}
