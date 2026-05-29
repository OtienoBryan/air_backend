import { Repository, DataSource } from 'typeorm';
import { Payroll } from '../entities/payroll.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Staff } from '../entities/staff.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
export declare class PayrollService {
    private payrollRepository;
    private chartOfAccountRepository;
    private journalEntryRepository;
    private journalEntryLineRepository;
    private staffRepository;
    private dataSource;
    constructor(payrollRepository: Repository<Payroll>, chartOfAccountRepository: Repository<ChartOfAccount>, journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, staffRepository: Repository<Staff>, dataSource: DataSource);
    findAll(page?: number, limit?: number): Promise<{
        payroll: Payroll[];
        total: number;
    }>;
    findOne(id: number): Promise<Payroll>;
    private generateEntryNumber;
    create(createPayrollDto: CreatePayrollDto, createdBy?: number | null): Promise<Payroll>;
    private createJournalEntryWithTransaction;
}
