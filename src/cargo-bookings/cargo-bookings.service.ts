import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoBooking } from '../entities/cargo-booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { CreateCargoBookingDto } from './dto/create-cargo-booking.dto';

@Injectable()
export class CargoBookingsService {
  constructor(
    @InjectRepository(CargoBooking)
    private cargoBookingRepository: Repository<CargoBooking>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
  ) { }

  async create(dto: CreateCargoBookingDto): Promise<CargoBooking> {
    console.log('📦 [CargoBookingsService] Creating cargo booking', { awb_number: dto.awb_number });

    let flightSeries: FlightSeries | null = null;
    if (dto.flight_series_id) {
      flightSeries = await this.flightSeriesRepository.findOne({ where: { id: dto.flight_series_id } });
      if (!flightSeries) {
        throw new NotFoundException(`Flight series with ID ${dto.flight_series_id} not found`);
      }
    }

    const entity = this.cargoBookingRepository.create({
      awb_number: dto.awb_number.trim(),
      flight_series_id: dto.flight_series_id ?? null,
      flightSeries: flightSeries ?? null,
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
  ): Promise<{ cargoBookings: CargoBooking[]; total: number }> {
    const where: any = {};
    if (flightSeriesId !== undefined && !Number.isNaN(flightSeriesId)) {
      where.flight_series_id = flightSeriesId;
    }

    const [cargoBookings, total] = await this.cargoBookingRepository.findAndCount({
      relations: ['flightSeries'],
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
      relations: ['flightSeries'],
    });
    if (!cargo) throw new NotFoundException(`Cargo booking with ID ${id} not found`);
    return cargo;
  }

  async assignFlight(id: number, flightSeriesId: number | null): Promise<CargoBooking> {
    const cargo = await this.findOne(id);
    let flightSeries: FlightSeries | null = null;

    if (flightSeriesId) {
      flightSeries = await this.flightSeriesRepository.findOne({ where: { id: flightSeriesId } });
      if (!flightSeries) throw new NotFoundException(`Flight series with ID ${flightSeriesId} not found`);
    }

    cargo.flight_series_id = flightSeriesId ?? null;
    cargo.flightSeries = flightSeries ?? null;
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

