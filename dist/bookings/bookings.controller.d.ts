import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddBookingPassengerDto } from './dto/add-booking-passenger.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    getSeatCounts(flightSeriesId: number): Promise<Record<string, number>>;
    getPassengersByFlight(flightSeriesId: number): Promise<any[]>;
    findOne(id: number): Promise<Booking>;
    addPassenger(id: number, addBookingPassengerDto: AddBookingPassengerDto): Promise<Booking>;
    updateBookingPassengerStatus(id: number, body: {
        status: string;
    }, req: any): Promise<any>;
}
