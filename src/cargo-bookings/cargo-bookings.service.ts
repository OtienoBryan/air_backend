import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { CreateCargoBookingDto } from './dto/create-cargo-booking.dto';

@Injectable()
export class CargoBookingsService {
  constructor(
    @InjectRepository(CargoBooking)
    private cargoBookingRepository: Repository<CargoBooking>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) { }

  // A flight_series can have multiple dated flights generated from it — resolve the
  // one specific occurrence matching the series' own start_date (the common case in
  // this system, where each series row corresponds to one flight occurrence).
  private async resolveFlightId(flightSeries: FlightSeries): Promise<number | null> {
    const flight = await this.flightRepository.findOne({
      where: { series_id: flightSeries.id, flight_date: flightSeries.start_date as any },
    });
    return flight?.id ?? null;
  }

  async create(dto: CreateCargoBookingDto): Promise<CargoBooking> {
    console.log('📦 [CargoBookingsService] Creating cargo booking', { awb_number: dto.awb_number });

    let flightSeries: FlightSeries | null = null;
    let flightId: number | null = null;
    if (dto.flight_series_id) {
      flightSeries = await this.flightSeriesRepository.findOne({ where: { id: dto.flight_series_id } });
      if (!flightSeries) {
        throw new NotFoundException(`Flight series with ID ${dto.flight_series_id} not found`);
      }
      flightId = await this.resolveFlightId(flightSeries);
    }

    const entity = this.cargoBookingRepository.create({
      awb_number: dto.awb_number.trim(),
      flight_series_id: dto.flight_series_id ?? null,
      flightSeries: flightSeries ?? null,
      flight_id: flightId,
      origin: dto.origin.trim().toUpperCase(),
      destination: dto.destination.trim().toUpperCase(),

      shipper_name: dto.shipper_name.trim(),
      shipper_phone: dto.shipper_phone?.trim() ?? null,
      shipper_address: dto.shipper_address?.trim() ?? null,

      consignee_name: dto.consignee_name.trim(),
      consignee_phone: dto.consignee_phone?.trim() ?? null,
      consignee_address: dto.consignee_address?.trim() ?? null,

      commodity_type: (dto as any).commodity?.trim?.() ?? '',
      special_handling_codes: dto.special_handling_codes?.trim() ?? null,
      pieces: dto.pieces,
      gross_weight_kg: dto.gross_weight_kg,
      chargeable_weight_kg: dto.chargeable_weight_kg,
      volume_cbm: dto.volume_cbm ?? null,

      currency: (dto.currency ?? 'USD').trim().toUpperCase(),
      payment_term: (dto.payment_term ?? 'PREPAID').trim().toUpperCase(),
      rate_per_kg: dto.rate_per_kg ?? null,
      total_charges: dto.total_charges ?? 0,

      booking_date: new Date(dto.booking_date),
      status: dto.status ?? 'booked',
      remarks: dto.remarks?.trim() ?? null,
    });

    const saved = await this.cargoBookingRepository.save(entity);
    return this.findOne(saved.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
    flightSeriesId?: number,
    flightId?: number,
  ): Promise<{ cargoBookings: CargoBooking[]; total: number }> {
    const where: any = {};
    // flight_id scopes to the specific flight occurrence — preferred over
    // flight_series_id alone when known, since a series can recur over many dates.
    if (flightId !== undefined && !Number.isNaN(flightId)) {
      where.flight_id = flightId;
    } else if (flightSeriesId !== undefined && !Number.isNaN(flightSeriesId)) {
      where.flight_series_id = flightSeriesId;
    }

    const [cargoBookings, total] = await this.cargoBookingRepository.findAndCount({
      relations: ['flightSeries', 'flight'],
      order: { booking_date: 'DESC', created_at: 'DESC' },
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { cargoBookings, total };
  }

  async findOne(id: number): Promise<CargoBooking> {
    const cargo = await this.cargoBookingRepository.findOne({
      where: { id },
      relations: ['flightSeries', 'flight'],
    });
    if (!cargo) throw new NotFoundException(`Cargo booking with ID ${id} not found`);
    return cargo;
  }

  async assignFlight(id: number, flightSeriesId: number | null): Promise<CargoBooking> {
    const cargo = await this.findOne(id);
    let flightSeries: FlightSeries | null = null;
    let flightId: number | null = null;

    if (flightSeriesId) {
      flightSeries = await this.flightSeriesRepository.findOne({ where: { id: flightSeriesId } });
      if (!flightSeries) throw new NotFoundException(`Flight series with ID ${flightSeriesId} not found`);
      flightId = await this.resolveFlightId(flightSeries);
    }

    cargo.flight_series_id = flightSeriesId ?? null;
    cargo.flightSeries = flightSeries ?? null;
    cargo.flight_id = flightId;
    await this.cargoBookingRepository.save(cargo);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: string): Promise<CargoBooking> {
    const cargo = await this.findOne(id);
    cargo.status = status as CargoBooking['status'];
    await this.cargoBookingRepository.save(cargo);
    return this.findOne(id);
  }

  async updatePrice(id: number, data: { total_charges: number; currency?: string; rate_per_kg?: number | null }): Promise<CargoBooking> {
    const cargo = await this.findOne(id);
    cargo.total_charges = data.total_charges;
    if (data.currency !== undefined) cargo.currency = data.currency;
    if (data.rate_per_kg !== undefined) cargo.rate_per_kg = data.rate_per_kg;
    await this.cargoBookingRepository.save(cargo);
    return this.findOne(id);
  }

  async recordPayment(id: number, data: {
    amount_paid: number;
    payment_reference?: string;
    payment_account?: string;
    payment_account_id?: number | null;
    payment_date: string;
    payment_status?: string;
    payment_confirmed_by?: string;
  }): Promise<CargoBooking> {
    const cargo = await this.findOne(id);
    cargo.amount_paid       = data.amount_paid;
    cargo.payment_reference = data.payment_reference ?? null;
    cargo.payment_account   = data.payment_account   ?? null;
    cargo.payment_account_id = data.payment_account_id ?? null;
    cargo.payment_date           = data.payment_date;
    cargo.payment_confirmed_by   = data.payment_confirmed_by ?? null;
    // auto-derive status if not explicitly provided
    if (data.payment_status) {
      cargo.payment_status = data.payment_status;
    } else {
      const total = Number(cargo.total_charges) || 0;
      const paid  = Number(data.amount_paid)   || 0;
      cargo.payment_status = paid <= 0 ? 'unpaid' : paid >= total ? 'paid' : 'partial';
    }
    await this.cargoBookingRepository.save(cargo);
    return this.findOne(id);
  }
}

