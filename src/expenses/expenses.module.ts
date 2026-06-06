import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController, ChartOfAccountsController, ExpenseCategoriesController, ExpenseTypesController } from './expenses.controller';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { Account } from '../entities/account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { ExpenseType } from '../entities/expense-type.entity';
import { FlightRoute } from '../entities/flight-route.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Flight } from '../entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ChartOfAccount, Account, JournalEntry, JournalEntryLine, Supplier, SupplierLedger, ExpenseCategory, ExpenseType, FlightRoute, Aircraft, Flight])],
  controllers: [ExpensesController, ChartOfAccountsController, ExpenseCategoriesController, ExpenseTypesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
