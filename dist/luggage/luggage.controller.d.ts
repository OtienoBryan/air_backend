import { Repository, DataSource } from 'typeorm';
import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';
export declare class LuggageController {
    private readonly luggageService;
    private readonly excessChargeRepository;
    private readonly journalEntryRepository;
    private readonly journalEntryLineRepository;
    private readonly chartOfAccountRepository;
    private readonly dataSource;
    constructor(luggageService: LuggageService, excessChargeRepository: Repository<LuggageExcessCharge>, journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, chartOfAccountRepository: Repository<ChartOfAccount>, dataSource: DataSource);
    create(createLuggageDto: CreateLuggageDto): Promise<Luggage>;
    findAllWithDetails(flightSeriesId?: string, flightIdParam?: string): Promise<any[]>;
    findAllByPassenger(passengerId: number): Promise<Luggage[]>;
    findOne(id: number): Promise<Luggage>;
    update(id: number, updateLuggageDto: UpdateLuggageDto, req: any): Promise<Luggage>;
    remove(id: number): Promise<{
        message: string;
    }>;
    removeAllByPassenger(passengerId: number): Promise<{
        message: string;
    }>;
    postExcessCharge(body: {
        passenger_id: number;
        booking_id?: number | null;
        flight_id?: number | null;
        flight_series_id?: number | null;
        route_id?: number | null;
        total_weight: number;
        weight_limit: number;
        excess_kg: number;
        charge_per_kg: number;
        total_charge: number;
        currency?: string;
        payment_method?: string;
        payment_status?: string;
        payment_account_id?: number | null;
        notes?: string | null;
    }, req: any): Promise<LuggageExcessCharge>;
    private generateEntryNumber;
    private postJournalEntryForExcessCharge;
    getExcessCharges(flightId?: string, passengerId?: string): Promise<LuggageExcessCharge[]>;
    deleteExcessCharge(id: number): Promise<{
        message: string;
    }>;
}
