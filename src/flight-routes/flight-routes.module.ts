import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightRoutesService } from './flight-routes.service';
import { FlightRoutesController } from './flight-routes.controller';
import { FlightRoute } from '../entities/flight-route.entity';
import { FareHistory } from '../entities/fare-history.entity';
import { RouteFareCharge } from '../entities/route-fare-charge.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { RouteLuggageSetting } from '../entities/route-luggage-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlightRoute, FareHistory, RouteFareCharge, ChartOfAccount, RouteLuggageSetting])],
  controllers: [FlightRoutesController],
  providers: [FlightRoutesService],
  exports: [FlightRoutesService],
})
export class FlightRoutesModule {}
