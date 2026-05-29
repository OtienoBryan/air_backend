import { JournalEntry } from '../entities/journal-entry.entity';
import { ExpensesService } from './expenses.service';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
export declare class ExpensesController {
    private readonly expensesService;
    private chartOfAccountRepository;
    constructor(expensesService: ExpensesService, chartOfAccountRepository: Repository<ChartOfAccount>);
    findAll(page?: number, limit?: number): Promise<{
        expenses: Expense[];
        total: number;
    }>;
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<Expense>;
    updatePayment(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense>;
    getPaymentHistory(id: number): Promise<JournalEntry[]>;
}
export declare class ChartOfAccountsController {
    private chartOfAccountRepository;
    constructor(chartOfAccountRepository: Repository<ChartOfAccount>);
    findByType(accountType?: number): Promise<ChartOfAccount[]>;
}
