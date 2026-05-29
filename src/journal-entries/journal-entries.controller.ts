import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/journal-entries')
@UseGuards(JwtAuthGuard)
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 15,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('account_id') accountId?: string,
    @Query('reference') reference?: string,
    @Query('description') description?: string,
  ) {
    console.log('📝 [JournalEntriesController] GET /admin/journal-entries');
    console.log('📝 [JournalEntriesController] Query params:', { page, limit, startDate, endDate, accountId, reference, description });

    const accountIdNum = accountId ? parseInt(accountId, 10) : undefined;

    try {
      return await this.journalEntriesService.findAll(
        page,
        limit,
        startDate,
        endDate,
        accountIdNum,
        reference,
        description,
      );
    } catch (error) {
      console.error('❌ [JournalEntriesController] Error:', error);
      throw error;
    }
  }
}
