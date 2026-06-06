import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('profit')
  getProfitReport(
    @Query('groupBy') groupBy: 'route' | 'aircraft' | 'flight' = 'route',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<any[]> {
    return this.reportsService.getProfitReport(groupBy, from, to);
  }
}
