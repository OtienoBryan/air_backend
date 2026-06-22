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
exports.LuggageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const luggage_entity_1 = require("../entities/luggage.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const booking_entity_1 = require("../entities/booking.entity");
let LuggageService = class LuggageService {
    luggageRepository;
    bookingPassengerRepository;
    bookingRepository;
    constructor(luggageRepository, bookingPassengerRepository, bookingRepository) {
        this.luggageRepository = luggageRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.bookingRepository = bookingRepository;
    }
    async create(createLuggageDto) {
        console.log('🧳 [LuggageService] Creating new luggage:', createLuggageDto);
        if (createLuggageDto.tag_number && createLuggageDto.tag_number.trim() !== '') {
            const existingLuggage = await this.luggageRepository.findOne({
                where: { tag_number: createLuggageDto.tag_number.trim() },
            });
            if (existingLuggage) {
                throw new common_1.ConflictException(`Tag number "${createLuggageDto.tag_number}" already exists`);
            }
        }
        if (!createLuggageDto.flight_series_id || !createLuggageDto.booking_id) {
            const bookingPassenger = await this.bookingPassengerRepository.findOne({
                where: { passenger_id: createLuggageDto.passenger_id },
                relations: ['booking'],
                order: { created_at: 'DESC' },
            });
            if (bookingPassenger?.booking) {
                if (!createLuggageDto.flight_series_id) {
                    createLuggageDto.flight_series_id = bookingPassenger.booking.flight_series_id;
                }
                if (!createLuggageDto.booking_id) {
                    createLuggageDto.booking_id = bookingPassenger.booking.id;
                }
            }
        }
        const luggage = this.luggageRepository.create({
            ...createLuggageDto,
            tag_number: createLuggageDto.tag_number?.trim() || null,
        });
        const savedLuggage = await this.luggageRepository.save(luggage);
        console.log(`✅ [LuggageService] Luggage created: ${savedLuggage.id}`);
        return savedLuggage;
    }
    async findAllByPassenger(passengerId) {
        console.log(`🧳 [LuggageService] Finding all luggage for passenger: ${passengerId}`);
        return this.luggageRepository.find({
            where: { passenger_id: passengerId },
            order: { created_at: 'ASC' },
        });
    }
    async findOne(id) {
        const luggage = await this.luggageRepository.findOne({ where: { id } });
        if (!luggage) {
            throw new common_1.NotFoundException(`Luggage with ID ${id} not found`);
        }
        return luggage;
    }
    async update(id, updateLuggageDto, updatedBy) {
        console.log(`🧳 [LuggageService] Updating luggage ID: ${id}`);
        const luggage = await this.findOne(id);
        if (updateLuggageDto.tag_number !== undefined) {
            const trimmedTagNumber = updateLuggageDto.tag_number?.trim() || null;
            if (trimmedTagNumber && trimmedTagNumber !== '') {
                const existingLuggage = await this.luggageRepository.findOne({
                    where: { tag_number: trimmedTagNumber },
                });
                if (existingLuggage && existingLuggage.id !== id) {
                    throw new common_1.ConflictException(`Tag number "${trimmedTagNumber}" already exists`);
                }
            }
            luggage.tag_number = trimmedTagNumber;
        }
        if (updateLuggageDto.weight !== undefined) {
            luggage.weight = updateLuggageDto.weight ?? null;
        }
        if (updateLuggageDto.excess_kg !== undefined) {
            luggage.excess_kg = updateLuggageDto.excess_kg ?? 0;
        }
        if (updateLuggageDto.excess_charge !== undefined) {
            luggage.excess_charge = updateLuggageDto.excess_charge ?? 0;
        }
        if (updateLuggageDto.collected !== undefined) {
            luggage.collected = updateLuggageDto.collected;
        }
        if (updatedBy !== undefined) {
            luggage.updated_by = updatedBy ?? null;
        }
        const updatedLuggage = await this.luggageRepository.save(luggage);
        console.log(`✅ [LuggageService] Luggage updated: ${updatedLuggage.id}`);
        return updatedLuggage;
    }
    async remove(id) {
        console.log(`🧳 [LuggageService] Deleting luggage ID: ${id}`);
        const luggage = await this.findOne(id);
        await this.luggageRepository.remove(luggage);
        console.log(`✅ [LuggageService] Luggage deleted: ${id}`);
    }
    async removeAllByPassenger(passengerId) {
        console.log(`🧳 [LuggageService] Deleting all luggage for passenger: ${passengerId}`);
        await this.luggageRepository.delete({ passenger_id: passengerId });
        console.log(`✅ [LuggageService] All luggage deleted for passenger: ${passengerId}`);
    }
    async findAllWithDetails(flightSeriesId) {
        console.log(`🧳 [LuggageService] Finding all luggage with details${flightSeriesId ? ` for flight: ${flightSeriesId}` : ''}`);
        const query = this.luggageRepository
            .createQueryBuilder('luggage')
            .leftJoinAndSelect('luggage.passenger', 'passenger')
            .leftJoinAndSelect('luggage.flightSeries', 'flightSeries')
            .leftJoinAndSelect('luggage.booking', 'booking')
            .leftJoinAndSelect('flightSeries.fromDestination', 'fromDestination')
            .leftJoinAndSelect('flightSeries.toDestination', 'toDestination')
            .leftJoinAndSelect('flightSeries.viaDestination', 'viaDestination')
            .orderBy('luggage.created_at', 'ASC');
        if (flightSeriesId) {
            query.andWhere('luggage.flight_series_id = :flightSeriesId', { flightSeriesId });
        }
        const luggages = await query.getMany();
        const enrichedLuggages = luggages.map((luggage) => {
            return {
                ...luggage,
                booking_reference: luggage.booking_reference || luggage.booking?.booking_reference || null,
                flight_series_id: luggage.flight_series_id || null,
                flightSeries: luggage.flightSeries || null,
            };
        });
        return enrichedLuggages;
    }
};
exports.LuggageService = LuggageService;
exports.LuggageService = LuggageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(luggage_entity_1.Luggage)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_passenger_entity_1.BookingPassenger)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LuggageService);
//# sourceMappingURL=luggage.service.js.map