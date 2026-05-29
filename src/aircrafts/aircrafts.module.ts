import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AircraftsService } from './aircrafts.service';
import { AircraftsController } from './aircrafts.controller';
import { Aircraft } from '../entities/aircraft.entity';
import { Category } from '../entities/category.entity';
import { Staff } from '../entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aircraft, Category, Staff])],
  controllers: [AircraftsController],
  providers: [AircraftsService],
  exports: [AircraftsService],
})
export class AircraftsModule {}

