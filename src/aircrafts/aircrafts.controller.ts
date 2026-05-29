import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  ParseIntPipe,
  Query,
  UseGuards 
} from '@nestjs/common';
import { AircraftsService } from './aircrafts.service';
import { Aircraft } from '../entities/aircraft.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Controller('admin/aircrafts')
@UseGuards(JwtAuthGuard)
export class AircraftsController {
  constructor(private readonly aircraftsService: AircraftsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ aircrafts: Aircraft[], total: number }> {
    console.log('✈️ [AircraftsController] GET /admin/aircrafts', { page, limit });
    return this.aircraftsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Aircraft> {
    console.log(`✈️ [AircraftsController] GET /admin/aircrafts/${id}`);
    return this.aircraftsService.findOne(id);
  }

  @Post()
  async create(@Body() createAircraftDto: CreateAircraftDto): Promise<Aircraft> {
    console.log('✈️ [AircraftsController] POST /admin/aircrafts');
    console.log('✈️ [AircraftsController] Create aircraft data:', JSON.stringify(createAircraftDto, null, 2));
    try {
      const result = await this.aircraftsService.create(createAircraftDto);
      console.log('✅ [AircraftsController] Aircraft created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [AircraftsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAircraftDto: UpdateAircraftDto
  ): Promise<Aircraft> {
    console.log(`✈️ [AircraftsController] PUT /admin/aircrafts/${id}`);
    console.log('✈️ [AircraftsController] Update aircraft data:', updateAircraftDto);
    return this.aircraftsService.update(id, updateAircraftDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`✈️ [AircraftsController] DELETE /admin/aircrafts/${id}`);
    await this.aircraftsService.remove(id);
    return { message: 'Aircraft deleted successfully' };
  }
}

