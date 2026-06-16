import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Luggage } from '../entities/luggage.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { Booking } from '../entities/booking.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { LuggageService } from './luggage.service';
import { LuggageController } from './luggage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Luggage, BookingPassenger, Booking, LuggageExcessCharge])],
  providers: [LuggageService],
  controllers: [LuggageController],
  exports: [LuggageService],
})
export class LuggageModule {}

