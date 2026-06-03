"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoBookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cargo_booking_entity_1 = require("../entities/cargo-booking.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
let CargoBookingsService = class CargoBookingsService {
    cargoBookingRepository;
    flightSeriesRepository;
    constructor(cargoBookingRepository, flightSeriesRepository) {
        this.cargoBookingRepository = cargoBookingRepository;
        this.flightSeriesRepository = flightSeriesRepository;
    }
    async create(dto) {
        console.log('📦 [CargoBookingsService] Creating cargo booking', { awb_number: dto.awb_number });
        let flightSeries = null;
        if (dto.flight_series_id) {
            flightSeries = await this.flightSeriesRepository.findOne({ where: { id: dto.flight_series_id } });
            if (!flightSeries) {
                throw new common_1.NotFoundException(`Flight series with ID ${dto.flight_series_id} not found`);
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
            commodity_type: dto.commodity?.trim?.() ?? '',
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
    async findAll(page = 1, limit = 50, flightSeriesId) {
        const where = {};
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
    async findOne(id) {
        const cargo = await this.cargoBookingRepository.findOne({
            where: { id },
            relations: ['flightSeries'],
        });
        if (!cargo)
            throw new common_1.NotFoundException(`Cargo booking with ID ${id} not found`);
        return cargo;
    }
    async assignFlight(id, flightSeriesId) {
        const cargo = await this.findOne(id);
        let flightSeries = null;
        if (flightSeriesId) {
            flightSeries = await this.flightSeriesRepository.findOne({ where: { id: flightSeriesId } });
            if (!flightSeries)
                throw new common_1.NotFoundException(`Flight series with ID ${flightSeriesId} not found`);
        }
        cargo.flight_series_id = flightSeriesId ?? null;
        cargo.flightSeries = flightSeries ?? null;
        await this.cargoBookingRepository.save(cargo);
        return this.findOne(id);
    }
    async recordPayment(id, data) {
        const cargo = await this.findOne(id);
        cargo.amount_paid = data.amount_paid;
        cargo.payment_reference = data.payment_reference ?? null;
        cargo.payment_account = data.payment_account ?? null;
        cargo.payment_account_id = data.payment_account_id ?? null;
        cargo.payment_date = data.payment_date;
        cargo.payment_confirmed_by = data.payment_confirmed_by ?? null;
        if (data.payment_status) {
            cargo.payment_status = data.payment_status;
        }
        else {
            const total = Number(cargo.total_charges) || 0;
            const paid = Number(data.amount_paid) || 0;
            cargo.payment_status = paid <= 0 ? 'unpaid' : paid >= total ? 'paid' : 'partial';
        }
        await this.cargoBookingRepository.save(cargo);
        return this.findOne(id);
    }
};
exports.CargoBookingsService = CargoBookingsService;
exports.CargoBookingsService = CargoBookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cargo_booking_entity_1.CargoBooking)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_series_entity_1.FlightSeries)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CargoBookingsService);
//# sourceMappingURL=cargo-bookings.service.js.map