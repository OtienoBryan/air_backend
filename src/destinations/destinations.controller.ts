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
import { DestinationsService } from './destinations.service';
import { Destination } from '../entities/destination.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('admin/destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ destinations: Destination[], total: number }> {
    console.log('🌍 [DestinationsController] GET /admin/destinations', { page, limit });
    return this.destinationsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Destination> {
    console.log(`🌍 [DestinationsController] GET /admin/destinations/${id}`);
    return this.destinationsService.findOne(id);
  }

  @Post()
  async create(@Body() createDestinationDto: CreateDestinationDto): Promise<Destination> {
    console.log('🌍 [DestinationsController] POST /admin/destinations');
    console.log('🌍 [DestinationsController] Create destination data:', JSON.stringify(createDestinationDto, null, 2));
    try {
      const result = await this.destinationsService.create(createDestinationDto);
      console.log('✅ [DestinationsController] Destination created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [DestinationsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDestinationDto: UpdateDestinationDto
  ): Promise<Destination> {
    console.log(`🌍 [DestinationsController] PUT /admin/destinations/${id}`);
    console.log('🌍 [DestinationsController] Update destination data:', updateDestinationDto);
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🌍 [DestinationsController] DELETE /admin/destinations/${id}`);
    await this.destinationsService.remove(id);
    return { message: 'Destination deleted successfully' };
  }
}

