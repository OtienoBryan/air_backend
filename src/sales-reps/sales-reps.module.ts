import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesRepsController } from './sales-reps.controller';
import { SalesRepsService } from './sales-reps.service';
import { SalesRepAttendanceController } from './sales-rep-attendance.controller';
import { SalesRepAttendanceService } from './sales-rep-attendance.service';
import { SalesRep } from '../entities/sales-rep.entity';
import { LoginHistory } from '../entities/login-history.entity';
import { Country } from '../entities/country.entity';
import { Region } from '../entities/region.entity';
import { Route } from '../entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesRep, LoginHistory, Country, Region, Route])],
  controllers: [SalesRepsController, SalesRepAttendanceController],
  providers: [SalesRepsService, SalesRepAttendanceService],
  exports: [SalesRepsService, SalesRepAttendanceService],
})
export class SalesRepsModule {}
