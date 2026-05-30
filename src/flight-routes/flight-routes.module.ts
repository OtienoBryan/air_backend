import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightRoutesService } from './flight-routes.service';
import { FlightRoutesController } from './flight-routes.controller';
import { FlightRoute } from '../entities/flight-route.entity';
import { FareHistory } from '../entities/fare-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlightRoute, FareHistory])],
  controllers: [FlightRoutesController],
  providers: [FlightRoutesService],
  exports: [FlightRoutesService],
})
export class FlightRoutesModule {}
