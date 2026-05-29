import { Repository, DataSource } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private expenseRepository;
    private chartOfAccountRepository;
    private journalEntryRepository;
    private journalEntryLineRepository;
    private supplierRepository;
    private supplierLedgerRepository;
    private dataSource;
    constructor(expenseRepository: Repository<Expense>, chartOfAccountRepository: Repository<ChartOfAccount>, journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, supplierRepository: Repository<Supplier>, supplierLedgerRepository: Repository<SupplierLedger>, dataSource: DataSource);
    findAll(page?: number, limit?: number): Promise<{
        expenses: Expense[];
        total: number;
    }>;
    findOne(id: number): Promise<Expense>;
    private generateEntryNumber;
    create(createExpenseDto: CreateExpenseDto, createdBy?: number | null): Promise<Expense>;
    private createJournalEntry;
    private createJournalEntryWithTransaction;
    updatePayment(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense>;
    getPaymentHistory(id: number): Promise<JournalEntry[]>;
}
