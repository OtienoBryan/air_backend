import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { CargoBookingsService } from './cargo-bookings.service';
import { CargoBookingsController } from './cargo-bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CargoBooking, FlightSeries, Flight])],
  providers: [CargoBookingsService],
  controllers: [CargoBookingsController],
  exports: [CargoBookingsService],
})
export class CargoBookingsModule { }

