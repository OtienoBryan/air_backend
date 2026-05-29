import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { FuelingService } from './fueling.service';
import { Fueling } from '../entities/fueling.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFuelingDto } from './dto/create-fueling.dto';

@Controller('admin/fueling')
@UseGuards(JwtAuthGuard)
export class FuelingController {
  constructor(private readonly fuelingService: FuelingService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ fuelings: Fueling[], total: number }> {
    console.log('⛽ [FuelingController] GET /admin/fueling', { page, limit });
    
    const result = await this.fuelingService.findAll(page, limit);
    
    console.log(`✅ [FuelingController] Returning ${result.fuelings.length} fuelings out of ${result.total} total`);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Fueling> {
    console.log(`⛽ [FuelingController] GET /admin/fueling/${id}`);
    
    const fueling = await this.fuelingService.findOne(id);
    
    console.log(`✅ [FuelingController] Fueling ${id} found`);
    return fueling;
  }

  @Post()
  async create(@Body() createFuelingDto: CreateFuelingDto, @Request() req): Promise<Fueling> {
    console.log('⛽ [FuelingController] POST /admin/fueling');
    console.log('⛽ [FuelingController] Create fueling data:', JSON.stringify(createFuelingDto, null, 2));
    console.log('⛽ [FuelingController] User ID:', req.user?.sub);
    try {
      const createdBy = req.user?.sub ? Number(req.user.sub) : null;
      const result = await this.fuelingService.create(createFuelingDto, createdBy);
      console.log('✅ [FuelingController] Fueling created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [FuelingController] Error in create:', error);
      throw error;
    }
  }
}
