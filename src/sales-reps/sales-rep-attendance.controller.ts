import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SalesRepAttendanceService, AttendanceRecord, AttendanceStats } from './sales-rep-attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales-reps/attendance')
@UseGuards(JwtAuthGuard)
export class SalesRepAttendanceController {
  constructor(
    private readonly attendanceService: SalesRepAttendanceService,
  ) {}

  @Get('records')
  async getAttendanceRecords(
    @Query('salesRepId') salesRepId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<AttendanceRecord[]> {
    console.log('📊 [SalesRepAttendanceController] Getting attendance records...', {
      salesRepId,
      startDate,
      endDate,
      status,
      limit,
      offset
    });
    
    console.log('📊 [SalesRepAttendanceController] Raw query parameters:', {
      salesRepIdType: typeof salesRepId,
      salesRepIdValue: salesRepId,
      startDateType: typeof startDate,
      startDateValue: startDate,
      endDateType: typeof endDate,
      endDateValue: endDate,
      statusType: typeof status,
      statusValue: status
    });

    const parsedSalesRepId = salesRepId ? parseInt(salesRepId, 10) : undefined;
    const parsedStatus = status ? parseInt(status, 10) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.attendanceService.getAttendanceRecords(
      parsedSalesRepId,
      startDate,
      endDate,
      parsedStatus,
      parsedLimit,
      parsedOffset
    );
  }

  @Get('stats')
  async getAttendanceStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AttendanceStats> {
    console.log('📊 [SalesRepAttendanceController] Getting attendance stats...', {
      startDate,
      endDate
    });

    return this.attendanceService.getAttendanceStats(startDate, endDate);
  }

  @Get('sales-reps')
  async getSalesReps() {
    console.log('👥 [SalesRepAttendanceController] Getting sales reps...');
    
    return this.attendanceService.getSalesReps();
  }
}
