import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController, ChartOfAccountsController } from './expenses.controller';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { Account } from '../entities/account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ChartOfAccount, Account, JournalEntry, JournalEntryLine, Supplier, SupplierLedger])],
  controllers: [ExpensesController, ChartOfAccountsController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
