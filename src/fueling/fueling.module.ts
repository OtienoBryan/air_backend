import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fueling } from '../entities/fueling.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Supplier } from '../entities/supplier.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { Account } from '../entities/account.entity';
import { FuelingController } from './fueling.controller';
import { FuelingService } from './fueling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fueling,
      FlightSeries,
      Supplier,
      ChartOfAccount,
      JournalEntry,
      JournalEntryLine,
      SupplierLedger,
      AccountLedger,
      Account,
    ]),
  ],
  controllers: [FuelingController],
  providers: [FuelingService],
  exports: [FuelingService],
})
export class FuelingModule {}
