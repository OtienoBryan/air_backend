import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CargoBookingsService } from './cargo-bookings.service';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { CreateCargoBookingDto } from './dto/create-cargo-booking.dto';
import { AssignCargoFlightDto } from './dto/assign-cargo-flight.dto';

@Controller('admin/cargo-bookings')
@UseGuards(JwtAuthGuard)
export class CargoBookingsController {
  constructor(private readonly cargoBookingsService: CargoBookingsService) { }

  @Post()
  async create(@Body() dto: CreateCargoBookingDto): Promise<CargoBooking> {
    console.log('📦 [CargoBookingsController] POST /admin/cargo-bookings');
    return this.cargoBookingsService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('flight_series_id') flightSeriesId?: string,
  ): Promise<{ cargoBookings: CargoBooking[]; total: number }> {
    console.log('📦 [CargoBookingsController] GET /admin/cargo-bookings', { page, limit, flightSeriesId });
    const fsId = flightSeriesId ? Number(flightSeriesId) : undefined;
    return this.cargoBookingsService.findAll(Number(page) || 1, Number(limit) || 50, fsId);
  }

  @Patch(':id/assign-flight')
  async assignFlight(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignCargoFlightDto,
  ): Promise<CargoBooking> {
    console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/assign-flight`, dto);
    return this.cargoBookingsService.assignFlight(id, dto.flight_series_id ?? null);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'booked' | 'accepted' | 'manifested' | 'flown' | 'delivered' | 'cancelled' },
  ): Promise<CargoBooking> {
    console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/status`, body);
    return this.cargoBookingsService.updateStatus(id, body.status);
  }

  @Patch(':id/payment')
  async recordPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      amount_paid: number;
      payment_reference?: string;
      payment_account?: string;
      payment_account_id?: number | null;
      payment_date: string;
      payment_status?: string;
      payment_confirmed_by?: string;
    },
  ): Promise<CargoBooking> {
    console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/payment`, body);
    return this.cargoBookingsService.recordPayment(id, body);
  }
}

