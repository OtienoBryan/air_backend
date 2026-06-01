import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    getSeatCounts(flightSeriesId: number): Promise<Record<string, number>>;
    findOne(id: number): Promise<Booking>;
}
