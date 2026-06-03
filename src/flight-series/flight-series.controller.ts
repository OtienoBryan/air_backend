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
import { FlightSeriesService } from './flight-series.service';
import { FlightSeries } from '../entities/flight-series.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFlightSeriesDto } from './dto/create-flight-series.dto';
import { UpdateFlightSeriesDto } from './dto/update-flight-series.dto';

@Controller('admin/flight-series')
@UseGuards(JwtAuthGuard)
export class FlightSeriesController {
  constructor(private readonly flightSeriesService: FlightSeriesService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ flightSeries: FlightSeries[], total: number }> {
    console.log('✈️ [FlightSeriesController] GET /admin/flight-series', { page, limit });
    return this.flightSeriesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FlightSeries> {
    console.log(`✈️ [FlightSeriesController] GET /admin/flight-series/${id}`);
    return this.flightSeriesService.findOne(id);
  }

  @Post()
  async create(@Body() createFlightSeriesDto: CreateFlightSeriesDto): Promise<FlightSeries> {
    console.log('✈️ [FlightSeriesController] POST /admin/flight-series');
    console.log('✈️ [FlightSeriesController] Create flight series data:', JSON.stringify(createFlightSeriesDto, null, 2));
    try {
      const result = await this.flightSeriesService.create(createFlightSeriesDto);
      console.log('✅ [FlightSeriesController] Flight series created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [FlightSeriesController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFlightSeriesDto: UpdateFlightSeriesDto
  ): Promise<FlightSeries> {
    console.log(`✈️ [FlightSeriesController] PUT /admin/flight-series/${id}`);
    console.log('✈️ [FlightSeriesController] Update flight series data:', updateFlightSeriesDto);
    return this.flightSeriesService.update(id, updateFlightSeriesDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`✈️ [FlightSeriesController] DELETE /admin/flight-series/${id}`);
    await this.flightSeriesService.remove(id);
    return { message: 'Flight series deleted successfully' };
  }

  @Post(':id/crew/:crewId')
  async assignCrew(
    @Param('id', ParseIntPipe) id: number,
    @Param('crewId', ParseIntPipe) crewId: number
  ): Promise<{ message: string }> {
    console.log(`✈️ [FlightSeriesController] POST /admin/flight-series/${id}/crew/${crewId}`);
    await this.flightSeriesService.assignCrew(id, crewId);
    return { message: 'Crew assigned successfully' };
  }

  @Delete(':id/crew/:crewId')
  async removeCrew(
    @Param('id', ParseIntPipe) id: number,
    @Param('crewId', ParseIntPipe) crewId: number
  ): Promise<{ message: string }> {
    console.log(`✈️ [FlightSeriesController] DELETE /admin/flight-series/${id}/crew/${crewId}`);
    await this.flightSeriesService.removeCrew(id, crewId);
    return { message: 'Crew removed successfully' };
  }

  @Get(':id/crew')
  async getCrewAssignments(@Param('id', ParseIntPipe) id: number) {
    console.log(`✈️ [FlightSeriesController] GET /admin/flight-series/${id}/crew`);
    return this.flightSeriesService.getCrewAssignments(id);
  }

  // Returns all individual flight instances for a series
  @Get(':id/flights')
  async getFlightInstances(
    @Param('id', ParseIntPipe) id: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.flightSeriesService.getFlightInstances(id, from, to);
  }

  // Regenerate flight instances for a series (e.g. after editing the series)
  @Post(':id/flights/regenerate')
  async regenerateFlightInstances(@Param('id', ParseIntPipe) id: number) {
    const count = await this.flightSeriesService.regenerateFlightInstances(id);
    return { message: `Generated ${count} flight instances`, count };
  }
}

