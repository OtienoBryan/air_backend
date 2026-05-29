import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { AccountType } from '../entities/account-type.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { JournalEntry } from '../entities/journal-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChartOfAccount, AccountType, JournalEntryLine, JournalEntry])],
  controllers: [ChartOfAccountsController],
  providers: [ChartOfAccountsService],
  exports: [ChartOfAccountsService],
})
export class ChartOfAccountsModule {}
