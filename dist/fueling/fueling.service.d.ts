import { Repository, DataSource } from 'typeorm';
import { Fueling } from '../entities/fueling.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Supplier } from '../entities/supplier.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { Account } from '../entities/account.entity';
import { CreateFuelingDto } from './dto/create-fueling.dto';
export declare class FuelingService {
    private fuelingRepository;
    private flightSeriesRepository;
    private supplierRepository;
    private chartOfAccountRepository;
    private journalEntryRepository;
    private journalEntryLineRepository;
    private supplierLedgerRepository;
    private accountLedgerRepository;
    private accountRepository;
    private dataSource;
    constructor(fuelingRepository: Repository<Fueling>, flightSeriesRepository: Repository<FlightSeries>, supplierRepository: Repository<Supplier>, chartOfAccountRepository: Repository<ChartOfAccount>, journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, supplierLedgerRepository: Repository<SupplierLedger>, accountLedgerRepository: Repository<AccountLedger>, accountRepository: Repository<Account>, dataSource: DataSource);
    findAll(page?: number, limit?: number): Promise<{
        fuelings: Fueling[];
        total: number;
    }>;
    findOne(id: number): Promise<Fueling>;
    private generateEntryNumber;
    create(createFuelingDto: CreateFuelingDto, createdBy?: number | null): Promise<Fueling>;
}
