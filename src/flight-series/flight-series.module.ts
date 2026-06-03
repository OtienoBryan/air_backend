import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { FlightException } from '../entities/flight-exception.entity';
import { ExceptionType } from '../entities/exception-type.entity';
import { PassengerDisruption } from '../entities/passenger-disruption.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { CrewAssignment } from '../entities/crew-assignment.entity';
import { Crew } from '../entities/crew.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightCrew } from '../entities/flight-crew.entity';
import { FlightSeriesService } from './flight-series.service';
import { FlightSeriesController } from './flight-series.controller';
import { FlightsController } from './flights.controller';
import { ExceptionTypesController } from './exception-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlightSeries, Flight, FlightException, ExceptionType, PassengerDisruption, CrewAssignment, BookingPassenger, Aircraft, Destination, FlightCrew, Crew])],
  providers: [FlightSeriesService],
  controllers: [FlightSeriesController, FlightsController, ExceptionTypesController],
  exports: [FlightSeriesService]
})
export class FlightSeriesModule {}

