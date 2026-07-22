import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Luggage } from '../entities/luggage.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { Booking } from '../entities/booking.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { LuggageService } from './luggage.service';
import { LuggageController } from './luggage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Luggage, BookingPassenger, Booking, LuggageExcessCharge,
    JournalEntry, JournalEntryLine, ChartOfAccount,
  ])],
  providers: [LuggageService],
  controllers: [LuggageController],
  exports: [LuggageService],
})
export class LuggageModule {}

