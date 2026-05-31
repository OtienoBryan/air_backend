import { Repository, DataSource } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PassengersService } from '../passengers/passengers.service';
export declare class BookingsService {
    private bookingRepository;
    private flightSeriesRepository;
    private passengerRepository;
    private bookingPassengerRepository;
    private seatReservationRepository;
    private agencyRepository;
    private agencyLedgerRepository;
    private journalEntryRepository;
    private journalEntryLineRepository;
    private chartOfAccountRepository;
    private passengersService;
    private dataSource;
    constructor(bookingRepository: Repository<Booking>, flightSeriesRepository: Repository<FlightSeries>, passengerRepository: Repository<Passenger>, bookingPassengerRepository: Repository<BookingPassenger>, seatReservationRepository: Repository<SeatReservation>, agencyRepository: Repository<Agency>, agencyLedgerRepository: Repository<AgencyLedger>, journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, chartOfAccountRepository: Repository<ChartOfAccount>, passengersService: PassengersService, dataSource: DataSource);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    private generateEntryNumber;
    private createJournalEntryForBooking;
    findAll(page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    findOne(id: number): Promise<Booking>;
    private generateBookingReference;
}
