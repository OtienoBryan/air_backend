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
import { SeatReservationsService } from './seat-reservations.service';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSeatReservationDto } from './dto/create-seat-reservation.dto';
import { UpdateSeatReservationDto } from './dto/update-seat-reservation.dto';

@Controller('admin/seat-reservations')
@UseGuards(JwtAuthGuard)
export class SeatReservationsController {
  constructor(private readonly seatReservationsService: SeatReservationsService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('flightSeriesId') flightSeriesId?: string,
    @Query('agentId') agentId?: string,
    @Query('status') status?: string,
  ): Promise<{ reservations: SeatReservation[], total: number }> {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 50;
    const parsedFlightSeriesId = flightSeriesId ? parseInt(flightSeriesId, 10) : undefined;
    const parsedAgentId = agentId ? parseInt(agentId, 10) : undefined;
    console.log('🎫 [SeatReservationsController] GET /admin/seat-reservations', { page: parsedPage, limit: parsedLimit, flightSeriesId: parsedFlightSeriesId, agentId: parsedAgentId, status });
    return this.seatReservationsService.findAll(parsedPage, parsedLimit, parsedFlightSeriesId, parsedAgentId, status);
  }

  @Get('flight-series/:flightSeriesId')
  async findByFlightSeries(@Param('flightSeriesId', ParseIntPipe) flightSeriesId: number): Promise<SeatReservation[]> {
    console.log(`🎫 [SeatReservationsController] GET /admin/seat-reservations/flight-series/${flightSeriesId}`);
    return this.seatReservationsService.findByFlightSeries(flightSeriesId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SeatReservation> {
    console.log(`🎫 [SeatReservationsController] GET /admin/seat-reservations/${id}`);
    return this.seatReservationsService.findOne(id);
  }

  @Post()
  async create(@Body() createSeatReservationDto: CreateSeatReservationDto): Promise<SeatReservation> {
    console.log('🎫 [SeatReservationsController] POST /admin/seat-reservations');
    console.log('🎫 [SeatReservationsController] Create reservation data:', JSON.stringify(createSeatReservationDto, null, 2));
    try {
      const result = await this.seatReservationsService.create(createSeatReservationDto);
      console.log('✅ [SeatReservationsController] Reservation created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [SeatReservationsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatReservationDto: UpdateSeatReservationDto
  ): Promise<SeatReservation> {
    console.log(`🎫 [SeatReservationsController] PUT /admin/seat-reservations/${id}`);
    console.log('🎫 [SeatReservationsController] Update reservation data:', updateSeatReservationDto);
    return this.seatReservationsService.update(id, updateSeatReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🎫 [SeatReservationsController] DELETE /admin/seat-reservations/${id}`);
    await this.seatReservationsService.remove(id);
    return { message: 'Seat reservation deleted successfully' };
  }
}

