import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { Agent } from '../entities/agent.entity';
import { Country } from '../entities/country.entity';
import { SeatReservationsService } from './seat-reservations.service';
import { SeatReservationsController } from './seat-reservations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeatReservation, FlightSeries, Passenger, Agent, Country])],
  providers: [SeatReservationsService],
  controllers: [SeatReservationsController],
  exports: [SeatReservationsService]
})
export class SeatReservationsModule {}

