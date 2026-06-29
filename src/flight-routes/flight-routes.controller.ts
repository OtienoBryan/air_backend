import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightRoutesService } from './flight-routes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FlightRoute } from '../entities/flight-route.entity';
import { RouteFareCharge } from '../entities/route-fare-charge.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { RouteLuggageSetting } from '../entities/route-luggage-setting.entity';

@Controller('admin/flight-routes')
@UseGuards(JwtAuthGuard)
export class FlightRoutesController {
  constructor(
    private readonly flightRoutesService: FlightRoutesService,
    @InjectRepository(RouteFareCharge)
    private readonly fareChargeRepository: Repository<RouteFareCharge>,
    @InjectRepository(ChartOfAccount)
    private readonly chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(RouteLuggageSetting)
    private readonly luggageRepository: Repository<RouteLuggageSetting>,
    @InjectRepository(FlightRoute)
    private readonly flightRouteRepository: Repository<FlightRoute>,
  ) {}

  @Get()
  findAll() {
    return this.flightRoutesService.findAll();
  }

  // Must be before :id to avoid route conflict
  @Get('luggage-by-destinations')
  async getLuggageByDestinations(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromId = parseInt(from, 10);
    const toId = parseInt(to, 10);
    const route = await this.flightRouteRepository.findOne({
      where: { from_destination_id: fromId, to_destination_id: toId },
    });
    if (!route) return [];
    return this.luggageRepository.find({
      where: { route_id: route.id },
      order: { id: 'ASC' },
    });
  }

  @Get('fare-accounts')
  async getFareAccounts() {
    return this.chartOfAccountRepository.find({
      where: { fare: 1 },
      order: { code: 'ASC' },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.findOne(id);
  }

  @Post()
  create(@Body() body: {
    from_destination_id: number;
    to_destination_id: number;
    via_destination_id?: number | null;
    adult_fare?: number | null;
    child_fare?: number | null;
    infant_fare?: number | null;
    adult_fare_origin_via?: number | null;
    child_fare_origin_via?: number | null;
    infant_fare_origin_via?: number | null;
    adult_fare_via_destination?: number | null;
    child_fare_via_destination?: number | null;
    infant_fare_via_destination?: number | null;
    adult_return_fare_origin_via?: number | null;
    child_return_fare_origin_via?: number | null;
    infant_return_fare_origin_via?: number | null;
    adult_return_fare_via_destination?: number | null;
    child_return_fare_via_destination?: number | null;
    infant_return_fare_via_destination?: number | null;
    currency?: string;
    status?: string;
  }) {
    return this.flightRoutesService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      from_destination_id?: number;
      to_destination_id?: number;
      via_destination_id?: number | null;
      adult_fare?: number | null;
      child_fare?: number | null;
      infant_fare?: number | null;
      adult_fare_origin_via?: number | null;
      child_fare_origin_via?: number | null;
      infant_fare_origin_via?: number | null;
      adult_fare_via_destination?: number | null;
      child_fare_via_destination?: number | null;
      infant_fare_via_destination?: number | null;
      adult_return_fare_origin_via?: number | null;
      child_return_fare_origin_via?: number | null;
      infant_return_fare_origin_via?: number | null;
      adult_return_fare_via_destination?: number | null;
      child_return_fare_via_destination?: number | null;
      infant_return_fare_via_destination?: number | null;
      currency?: string;
      status?: string;
    },
  ) {
    return this.flightRoutesService.update(id, body);
  }

  @Get(':id/fare-history')
  getFareHistory(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.getFareHistory(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.remove(id);
  }

  // ── Route Fare Charges ────────────────────────────────────────────────────

  @Get(':id/fare-charges')
  async getFareCharges(@Param('id', ParseIntPipe) routeId: number) {
    return this.fareChargeRepository.find({
      where: { route_id: routeId },
      relations: ['account'],
      order: { id: 'ASC' },
    });
  }

  @Post(':id/fare-charges')
  async addFareCharge(
    @Param('id', ParseIntPipe) routeId: number,
    @Body() body: { account_id: number; amount: number; currency?: string; label?: string },
  ) {
    const charge = this.fareChargeRepository.create({
      route_id: routeId,
      account_id: body.account_id,
      amount: body.amount,
      currency: body.currency ?? 'USD',
      label: body.label ?? null,
    });
    const saved = await this.fareChargeRepository.save(charge);
    return this.fareChargeRepository.findOne({ where: { id: saved.id }, relations: ['account'] });
  }

  @Put(':id/fare-charges/:chargeId')
  async updateFareCharge(
    @Param('id', ParseIntPipe) routeId: number,
    @Param('chargeId', ParseIntPipe) chargeId: number,
    @Body() body: { account_id?: number; amount?: number; currency?: string; label?: string },
  ) {
    await this.fareChargeRepository.update({ id: chargeId, route_id: routeId }, {
      ...(body.account_id !== undefined && { account_id: body.account_id }),
      ...(body.amount !== undefined && { amount: body.amount }),
      ...(body.currency !== undefined && { currency: body.currency }),
      ...(body.label !== undefined && { label: body.label }),
    });
    return this.fareChargeRepository.findOne({ where: { id: chargeId }, relations: ['account'] });
  }

  @Delete(':id/fare-charges/:chargeId')
  async deleteFareCharge(
    @Param('id', ParseIntPipe) routeId: number,
    @Param('chargeId', ParseIntPipe) chargeId: number,
  ) {
    await this.fareChargeRepository.delete({ id: chargeId, route_id: routeId });
    return { message: 'Deleted' };
  }

  // ── Route Luggage Settings ────────────────────────────────────────────────

  @Get(':id/luggage')
  async getLuggageSettings(@Param('id', ParseIntPipe) routeId: number) {
    return this.luggageRepository.find({
      where: { route_id: routeId },
      order: { id: 'ASC' },
    });
  }

  @Post(':id/luggage')
  async addLuggageSetting(
    @Param('id', ParseIntPipe) routeId: number,
    @Body() body: { type?: string; weight_limit: number; extra_charge_per_kg: number; currency?: string },
  ) {
    const setting = this.luggageRepository.create({
      route_id: routeId,
      type: body.type ?? 'Checked Baggage',
      weight_limit: body.weight_limit,
      extra_charge_per_kg: body.extra_charge_per_kg,
      currency: body.currency ?? 'USD',
    });
    return this.luggageRepository.save(setting);
  }

  @Put(':id/luggage/:settingId')
  async updateLuggageSetting(
    @Param('id', ParseIntPipe) routeId: number,
    @Param('settingId', ParseIntPipe) settingId: number,
    @Body() body: { type?: string; weight_limit?: number; extra_charge_per_kg?: number; currency?: string },
  ) {
    await this.luggageRepository.update({ id: settingId, route_id: routeId }, {
      ...(body.type !== undefined && { type: body.type }),
      ...(body.weight_limit !== undefined && { weight_limit: body.weight_limit }),
      ...(body.extra_charge_per_kg !== undefined && { extra_charge_per_kg: body.extra_charge_per_kg }),
      ...(body.currency !== undefined && { currency: body.currency }),
    });
    return this.luggageRepository.findOne({ where: { id: settingId } });
  }

  @Delete(':id/luggage/:settingId')
  async deleteLuggageSetting(
    @Param('id', ParseIntPipe) routeId: number,
    @Param('settingId', ParseIntPipe) settingId: number,
  ) {
    await this.luggageRepository.delete({ id: settingId, route_id: routeId });
    return { message: 'Deleted' };
  }
}
