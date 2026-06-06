import { JournalEntry } from '../entities/journal-entry.entity';
import { ExpensesService } from './expenses.service';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { ExpenseType } from '../entities/expense-type.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
export declare class ExpensesController {
    private readonly expensesService;
    private chartOfAccountRepository;
    private categoryRepository;
    private typeRepository;
    constructor(expensesService: ExpensesService, chartOfAccountRepository: Repository<ChartOfAccount>, categoryRepository: Repository<ExpenseCategory>, typeRepository: Repository<ExpenseType>);
    findAll(page?: number, limit?: number): Promise<{
        expenses: Expense[];
        total: number;
    }>;
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<Expense>;
    updatePayment(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense>;
    getReport(groupBy?: 'route' | 'aircraft' | 'flight' | 'expense_type', from?: string, to?: string): Promise<any[]>;
    getPaymentHistory(id: number): Promise<JournalEntry[]>;
}
export declare class ChartOfAccountsController {
    private chartOfAccountRepository;
    constructor(chartOfAccountRepository: Repository<ChartOfAccount>);
    findByType(accountType?: number): Promise<ChartOfAccount[]>;
}
export declare class ExpenseCategoriesController {
    private repo;
    constructor(repo: Repository<ExpenseCategory>);
    findAll(): Promise<ExpenseCategory[]>;
    create(body: {
        name: string;
        description?: string;
    }): Promise<ExpenseCategory>;
    update(id: number, body: {
        name?: string;
        description?: string;
        is_active?: number;
    }): Promise<ExpenseCategory>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export declare class ExpenseTypesController {
    private repo;
    constructor(repo: Repository<ExpenseType>);
    findAll(): Promise<ExpenseType[]>;
    create(body: {
        name: string;
        category_id?: number | null;
        description?: string;
    }): Promise<ExpenseType>;
    update(id: number, body: {
        name?: string;
        category_id?: number | null;
        description?: string;
        is_active?: number;
    }): Promise<ExpenseType>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
