import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notices')
@UseGuards(JwtAuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  async create(@Body() createNoticeDto: CreateNoticeDto) {
    console.log('🔍 [NoticesController] Creating notice:', createNoticeDto);
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  async findAll(
    @Query('countryId') countryId?: number,
    @Query('status') status?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    console.log('🔍 [NoticesController] Finding notices:', { countryId, status, limit, offset });
    const noticeLimit = limit ? Math.min(limit, 100) : 50; // Cap at 100 notices
    const noticeOffset = offset || 0;
    return this.noticesService.findAll(countryId, status, noticeLimit, noticeOffset);
  }

  @Get('active')
  async getActiveNotices(
    @Query('countryId') countryId?: number,
    @Query('limit') limit?: number
  ) {
    console.log('🔍 [NoticesController] Getting active notices:', { countryId, limit });
    const noticeLimit = limit ? Math.min(limit, 20) : 10; // Cap at 20 for active notices
    return this.noticesService.getActiveNotices(countryId, noticeLimit);
  }

  @Get('stats')
  async getStats() {
    console.log('🔍 [NoticesController] Getting notice statistics');
    return this.noticesService.getNoticeStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('🔍 [NoticesController] Finding notice by ID:', id);
    return this.noticesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateNoticeDto: UpdateNoticeDto
  ) {
    console.log('🔍 [NoticesController] Updating notice:', id, updateNoticeDto);
    return this.noticesService.update(id, updateNoticeDto);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    console.log('🔍 [NoticesController] Toggling notice status:', id);
    return this.noticesService.toggleStatus(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    console.log('🔍 [NoticesController] Deleting notice:', id);
    await this.noticesService.remove(id);
    return { success: true, message: 'Notice deleted successfully' };
  }
}
