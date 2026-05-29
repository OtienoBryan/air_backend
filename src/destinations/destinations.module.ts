import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '../entities/destination.entity';
import { Country } from '../entities/country.entity';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, Country])],
  providers: [DestinationsService],
  controllers: [DestinationsController],
  exports: [DestinationsService]
})
export class DestinationsModule {}

