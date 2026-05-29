import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    console.log(`🎫 [BookingsController] GET /admin/bookings/${id}`);
    return this.bookingsService.findOne(id);
  }
}

