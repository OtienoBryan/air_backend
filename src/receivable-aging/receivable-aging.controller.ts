import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReceivableAgingService, ReceivableAgingData, ReceivableAgingSummary } from './receivable-aging.service';

@Controller('admin/receivable-aging')
@UseGuards(JwtAuthGuard)
export class ReceivableAgingController {
  constructor(private readonly receivableAgingService: ReceivableAgingService) {}

  @Get()
  async getReceivableAging(): Promise<ReceivableAgingData[]> {
    console.log('🔍 [ReceivableAgingController] GET /admin/receivable-aging');
    try {
      const data = await this.receivableAgingService.getReceivableAging();
      console.log(`✅ [ReceivableAgingController] Returning ${data.length} clients with receivables`);
      return data;
    } catch (error) {
      console.error('❌ [ReceivableAgingController] Error:', error);
      throw error;
    }
  }

  @Get('summary')
  async getReceivableAgingSummary(): Promise<ReceivableAgingSummary> {
    console.log('🔍 [ReceivableAgingController] GET /admin/receivable-aging/summary');
    try {
      const summary = await this.receivableAgingService.getReceivableAgingSummary();
      console.log('✅ [ReceivableAgingController] Summary calculated:', summary);
      return summary;
    } catch (error) {
      console.error('❌ [ReceivableAgingController] Error calculating summary:', error);
      throw error;
    }
  }
}
