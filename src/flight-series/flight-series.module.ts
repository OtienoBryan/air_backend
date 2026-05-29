import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightSeries } from '../entities/flight-series.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightCrew } from '../entities/flight-crew.entity';
import { Crew } from '../entities/crew.entity';
import { FlightSeriesService } from './flight-series.service';
import { FlightSeriesController } from './flight-series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlightSeries, Aircraft, Destination, FlightCrew, Crew])],
  providers: [FlightSeriesService],
  controllers: [FlightSeriesController],
  exports: [FlightSeriesService]
})
export class FlightSeriesModule {}

