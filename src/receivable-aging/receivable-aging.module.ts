import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivableAgingController } from './receivable-aging.controller';
import { ReceivableAgingService } from './receivable-aging.service';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
import { ClientLedger } from '../entities/client-ledger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesOrder, Client, ClientLedger])
  ],
  controllers: [ReceivableAgingController],
  providers: [ReceivableAgingService],
  exports: [ReceivableAgingService],
})
export class ReceivableAgingModule {}
