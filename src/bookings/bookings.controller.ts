import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddBookingPassengerDto } from './dto/add-booking-passenger.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    console.log('🎫 [BookingsController] POST /admin/bookings');
    console.log('🎫 [BookingsController] Create booking data:', JSON.stringify(createBookingDto, null, 2));
    try {
      const result = await this.bookingsService.create(createBookingDto);
      console.log('✅ [BookingsController] Booking created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [BookingsController] Error in create:', error);
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ bookings: Booking[], total: number }> {
    console.log('🎫 [BookingsController] GET /admin/bookings', { page, limit });
    return this.bookingsService.findAll(page, limit);
  }

  @Get('seat-counts')
  async getSeatCounts(
    @Query('flightSeriesId') flightSeriesId: number,
  ): Promise<Record<string, number>> {
    return this.bookingsService.getBookedSeatCounts(Number(flightSeriesId));
  }

  // Returns all booking_passenger rows for a flight series, with full passenger details and fare
  @Get('passengers-by-flight')
  async getPassengersByFlight(
    @Query('flightSeriesId') flightSeriesId: number,
  ): Promise<any[]> {
    return this.bookingsService.getPassengersByFlight(Number(flightSeriesId));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    console.log(`🎫 [BookingsController] GET /admin/bookings/${id}`);
    return this.bookingsService.findOne(id);
  }

  @Post(':id/passengers')
  async addPassenger(
    @Param('id', ParseIntPipe) id: number,
    @Body() addBookingPassengerDto: AddBookingPassengerDto,
  ): Promise<Booking> {
    console.log(`🎫 [BookingsController] POST /admin/bookings/${id}/passengers`);
    return this.bookingsService.addPassengerToBooking(id, addBookingPassengerDto);
  }

  @Patch('booking-passengers/:id/status')
  async updateBookingPassengerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
    @Request() req,
  ) {
    const updatedBy = req.user?.sub ? Number(req.user.sub) : null;
    return this.bookingsService.updateBookingPassengerStatus(id, body.status, updatedBy);
  }
}

