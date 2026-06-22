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
  UseGuards,
  DefaultValuePipe,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';

@Controller('admin/luggage')
@UseGuards(JwtAuthGuard)
export class LuggageController {
  constructor(
    private readonly luggageService: LuggageService,
    @InjectRepository(LuggageExcessCharge)
    private readonly excessChargeRepository: Repository<LuggageExcessCharge>,
  ) {}

  @Post()
  async create(@Body() createLuggageDto: CreateLuggageDto): Promise<Luggage> {
    console.log('🧳 [LuggageController] POST /admin/luggage');
    return this.luggageService.create(createLuggageDto);
  }

  @Get('all')
  async findAllWithDetails(
    @Query('flightSeriesId') flightSeriesId?: string,
  ): Promise<any[]> {
    const flightId = flightSeriesId ? parseInt(flightSeriesId, 10) : undefined;
    if (flightSeriesId && isNaN(flightId!)) {
      throw new Error('flightSeriesId must be a valid number');
    }
    console.log(`🧳 [LuggageController] GET /admin/luggage/all${flightId ? `?flightSeriesId=${flightId}` : ''}`);
    return this.luggageService.findAllWithDetails(flightId);
  }

  @Get('passenger/:passengerId')
  async findAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<Luggage[]> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/passenger/${passengerId}`);
    return this.luggageService.findAllByPassenger(passengerId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Luggage> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/${id}`);
    return this.luggageService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLuggageDto: UpdateLuggageDto,
    @Request() req,
  ): Promise<Luggage> {
    console.log(`🧳 [LuggageController] PUT /admin/luggage/${id}`);
    const updatedBy = req.user?.sub ? Number(req.user.sub) : null;
    return this.luggageService.update(id, updateLuggageDto, updatedBy);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/${id}`);
    await this.luggageService.remove(id);
    return { message: 'Luggage deleted successfully' };
  }

  @Delete('passenger/:passengerId')
  async removeAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/passenger/${passengerId}`);
    await this.luggageService.removeAllByPassenger(passengerId);
    return { message: 'All luggage deleted successfully' };
  }

  // ── Excess Charges ────────────────────────────────────────────────────────

  @Post('excess-charges')
  async postExcessCharge(
    @Body() body: {
      passenger_id: number;
      booking_id?: number | null;
      flight_id?: number | null;
      flight_series_id?: number | null;
      route_id?: number | null;
      total_weight: number;
      weight_limit: number;
      excess_kg: number;
      charge_per_kg: number;
      total_charge: number;
      currency?: string;
      notes?: string | null;
    },
  ): Promise<LuggageExcessCharge> {
    // Upsert: replace existing record for same passenger+flight to avoid duplicates
    await this.excessChargeRepository.delete({
      passenger_id: body.passenger_id,
      flight_id: body.flight_id ?? undefined,
    });
    const record = this.excessChargeRepository.create({
      passenger_id:    body.passenger_id,
      booking_id:      body.booking_id ?? null,
      flight_id:       body.flight_id ?? null,
      flight_series_id: body.flight_series_id ?? null,
      route_id:        body.route_id ?? null,
      total_weight:    body.total_weight,
      weight_limit:    body.weight_limit,
      excess_kg:       body.excess_kg,
      charge_per_kg:   body.charge_per_kg,
      total_charge:    body.total_charge,
      currency:        body.currency ?? 'USD',
      notes:           body.notes ?? null,
    });
    return this.excessChargeRepository.save(record);
  }

  @Get('excess-charges')
  async getExcessCharges(
    @Query('flightId') flightId?: string,
    @Query('passengerId') passengerId?: string,
  ): Promise<LuggageExcessCharge[]> {
    const where: any = {};
    if (flightId) where.flight_id = parseInt(flightId, 10);
    if (passengerId) where.passenger_id = parseInt(passengerId, 10);
    return this.excessChargeRepository.find({
      where,
      relations: ['passenger'],
      order: { created_at: 'DESC' },
    });
  }

  @Delete('excess-charges/:id')
  async deleteExcessCharge(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.excessChargeRepository.delete(id);
    return { message: 'Deleted' };
  }
}

