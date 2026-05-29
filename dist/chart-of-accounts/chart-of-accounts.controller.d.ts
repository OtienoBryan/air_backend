import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { AccountType } from '../entities/account-type.entity';
export declare class ChartOfAccountsController {
    private readonly chartOfAccountsService;
    constructor(chartOfAccountsService: ChartOfAccountsService);
    findAll(accountType?: string): Promise<{
        accounts: ChartOfAccount[];
        total: number;
    }>;
    findAllAccountTypes(): Promise<AccountType[]>;
    getTrialBalance(startDate: string, endDate: string, accountType?: string): Promise<{
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
    findOne(id: number): Promise<ChartOfAccount>;
    create(createChartOfAccountDto: CreateChartOfAccountDto): Promise<ChartOfAccount>;
    update(id: number, updateChartOfAccountDto: UpdateChartOfAccountDto): Promise<ChartOfAccount>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
