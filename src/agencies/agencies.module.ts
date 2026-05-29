import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { AgencyDeposit } from '../entities/agency-deposit.entity';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, AgencyLedger, AgencyDeposit, Account, AccountLedger])],
  providers: [AgenciesService],
  controllers: [AgenciesController],
  exports: [AgenciesService]
})
export class AgenciesModule {}

