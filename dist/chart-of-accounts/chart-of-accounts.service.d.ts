import { Repository } from 'typeorm';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { AccountType } from '../entities/account-type.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';
export declare class ChartOfAccountsService {
    private chartOfAccountRepository;
    private accountTypeRepository;
    private journalEntryLineRepository;
    private journalEntryRepository;
    constructor(chartOfAccountRepository: Repository<ChartOfAccount>, accountTypeRepository: Repository<AccountType>, journalEntryLineRepository: Repository<JournalEntryLine>, journalEntryRepository: Repository<JournalEntry>);
    findAll(accountType?: number): Promise<{
        accounts: ChartOfAccount[];
        total: number;
    }>;
    findOne(id: number): Promise<ChartOfAccount>;
    create(createChartOfAccountDto: CreateChartOfAccountDto): Promise<ChartOfAccount>;
    update(id: number, updateChartOfAccountDto: UpdateChartOfAccountDto): Promise<ChartOfAccount>;
    remove(id: number): Promise<void>;
    findAllAccountTypes(): Promise<AccountType[]>;
    getTrialBalance(startDate: string, endDate: string, accountTypeId?: number): Promise<{
        accounts: Array<{
            account_id: number;
            account_code: string;
            account_name: string;
            category: string;
            opening_balance: number;
            debit: number;
            credit: number;
            period_balance: number;
            closing_balance: number;
        }>;
        totals: {
            total_debit: number;
            total_credit: number;
            total_period_balance: number;
            total_opening_balance: number;
            total_closing_balance: number;
        };
    }>;
}
