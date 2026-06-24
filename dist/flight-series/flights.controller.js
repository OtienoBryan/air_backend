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
exports.FlightsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_entity_1 = require("../entities/flight.entity");
const flight_exception_entity_1 = require("../entities/flight-exception.entity");
const exception_type_entity_1 = require("../entities/exception-type.entity");
const passenger_disruption_entity_1 = require("../entities/passenger-disruption.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const crew_assignment_entity_1 = require("../entities/crew-assignment.entity");
const crew_entity_1 = require("../entities/crew.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FlightsController = class FlightsController {
    flightRepository;
    exceptionRepository;
    exceptionTypeRepository;
    disruptionRepository;
    bookingPassengerRepository;
    crewAssignmentRepository;
    crewRepository;
    constructor(flightRepository, exceptionRepository, exceptionTypeRepository, disruptionRepository, bookingPassengerRepository, crewAssignmentRepository, crewRepository) {
        this.flightRepository = flightRepository;
        this.exceptionRepository = exceptionRepository;
        this.exceptionTypeRepository = exceptionTypeRepository;
        this.disruptionRepository = disruptionRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.crewAssignmentRepository = crewAssignmentRepository;
        this.crewRepository = crewRepository;
    }
    async findAll(page = 1, limit = 50, from, to, search, status, seriesId) {
        const qb = this.flightRepository
            .createQueryBuilder('f')
            .leftJoinAndSelect('f.series', 's')
            .leftJoinAndSelect('s.fromDestination', 'fd')
            .leftJoinAndSelect('s.toDestination', 'td')
            .leftJoinAndSelect('s.aircraft', 'ac')
            .leftJoinAndSelect('f.aircraft', 'fac')
            .orderBy('f.flight_date', 'ASC')
            .addOrderBy('f.flight_no', 'ASC');
        if (from)
            qb.andWhere('f.flight_date >= :from', { from });
        if (to)
            qb.andWhere('f.flight_date <= :to', { to });
        if (status)
            qb.andWhere('f.status = :status', { status });
        if (seriesId)
            qb.andWhere('f.series_id = :seriesId', { seriesId: Number(seriesId) });
        if (search)
            qb.andWhere('f.flight_no LIKE :search', { search: `%${search}%` });
        const total = await qb.getCount();
        const entities = await qb
            .skip((Number(page) - 1) * Number(limit))
            .take(Number(limit))
            .getMany();
        if (entities.length === 0)
            return { flights: [], total };
        const flightIds = entities.map(f => f.id).filter(Boolean);
        const countMap = new Map();
        if (flightIds.length > 0) {
            const rows = await this.flightRepository.query(`SELECT bp.flight_id,
                COUNT(*) AS cnt
         FROM booking_passengers bp
         WHERE (bp.status IS NULL OR bp.status != 'cancelled')
           AND bp.flight_id IN (${flightIds.join(',')})
         GROUP BY bp.flight_id`);
            console.log('✈️ [FlightsController] booked rows by flight_id:', rows.length, rows.slice(0, 3));
            for (const r of rows) {
                countMap.set(Number(r.flight_id), Number(r.cnt));
            }
        }
        const flights = entities.map(flight => {
            const fid = flight.id;
            const bookedCount = countMap.get(fid) ?? 0;
            const capacity = flight.aircraft_capacity ??
                flight.aircraft?.capacity ??
                flight.series?.aircraft?.capacity ??
                flight.series?.number_of_seats ??
                null;
            const available = capacity !== null ? Math.max(0, capacity - bookedCount) : null;
            return { ...flight, booked_count: bookedCount, available_seats: available };
        });
        return { flights, total };
    }
    async update(id, body) {
        const flight = await this.flightRepository.findOneOrFail({ where: { id } });
        if (body.flight_no !== undefined)
            flight.flight_no = body.flight_no;
        if (body.flight_date !== undefined)
            flight.flight_date = body.flight_date;
        if (body.std !== undefined)
            flight.std = body.std ?? null;
        if (body.sta !== undefined)
            flight.sta = body.sta ?? null;
        if (body.status !== undefined)
            flight.status = body.status;
        if (body.notes !== undefined)
            flight.notes = body.notes ?? null;
        return this.flightRepository.save(flight);
    }
    async addExtraFlight(flightId, body) {
        const original = await this.flightRepository.findOneOrFail({
            where: { id: flightId },
            relations: ['series'],
        });
        const extra = this.flightRepository.create({
            series_id: original.series_id,
            aircraft_id: body.aircraft_id,
            flight_no: original.flight_no,
            flight_date: original.flight_date,
            std: original.std,
            sta: original.sta,
            status: 'scheduled',
            is_extra: true,
            notes: body.notes ?? null,
        });
        return this.flightRepository.save(extra);
    }
    async getPassengers(id) {
        const rows = await this.bookingPassengerRepository.find({
            where: { flight_id: id },
            relations: [
                'passenger', 'booking',
                'flight', 'flight.series',
                'flight.series.fromDestination', 'flight.series.toDestination',
                'flight.series.viaDestination', 'flight.aircraft',
            ],
            order: { created_at: 'ASC' },
        });
        return rows.map(bp => ({
            id: bp.id,
            booking_id: bp.booking_id,
            booking_reference: bp.booking?.booking_reference ?? null,
            booking_date: bp.booking?.booking_date ? String(bp.booking.booking_date).slice(0, 10) : null,
            payment_status: bp.booking?.payment_status ?? null,
            passenger_type: bp.passenger_type,
            fare_amount: Number(bp.fare_amount ?? 0),
            travel_date: bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
            leg: bp.leg,
            status: bp.status ?? null,
            checked_in_at: bp.checked_in_at ?? null,
            boarded_at: bp.boarded_at ?? null,
            checkin_by: bp.checkin_by ?? null,
            ticket_status: bp.ticket_status ?? null,
            ticket_number: bp.ticket_number ?? null,
            refund_amount: bp.refund_amount ?? null,
            reschedule_fee: bp.reschedule_fee ?? null,
            cancellation_reason: bp.cancellation_reason ?? null,
            cancelled_at: bp.cancelled_at ?? null,
            rescheduled_to_id: bp.rescheduled_to_id ?? null,
            flight: bp.flight ? {
                id: bp.flight.id,
                flight_no: bp.flight.flight_no,
                flight_date: bp.flight.flight_date ? String(bp.flight.flight_date).slice(0, 10) : null,
                std: bp.flight.std ?? null,
                sta: bp.flight.sta ?? null,
                status: bp.flight.status,
                aircraft: bp.flight.aircraft ?? null,
                series: bp.flight.series ? {
                    id: bp.flight.series.id,
                    flt: bp.flight.series.flt,
                    std: bp.flight.series.std ?? null,
                    sta: bp.flight.series.sta ?? null,
                    fromDestination: bp.flight.series.fromDestination ?? null,
                    toDestination: bp.flight.series.toDestination ?? null,
                    viaDestination: bp.flight.series.viaDestination ?? null,
                } : null,
            } : null,
            passenger: bp.passenger ? {
                id: bp.passenger.id,
                pnr: bp.passenger.pnr,
                name: bp.passenger.name,
                title: bp.passenger.title ?? null,
                email: bp.passenger.email,
                contact: bp.passenger.contact,
                nationality: bp.passenger.nationality,
                id_type: bp.passenger.id_type,
                identification: bp.passenger.identification,
                booking_status: bp.passenger.booking_status ?? null,
                guardian_passenger_id: bp.passenger.guardian_passenger_id ?? null,
            } : null,
        }));
    }
    async getExceptions(id) {
        return this.exceptionRepository.find({
            where: { flight_id: id },
            relations: ['exceptionType'],
            order: { created_at: 'DESC' },
        });
    }
    async addException(flightId, body) {
        const exc = this.exceptionRepository.create({
            flight_id: flightId,
            exception_type: body.exception_type,
            reason: body.reason ?? null,
            old_value: body.old_value ?? null,
            new_value: body.new_value ?? null,
            created_by: body.created_by ?? null,
        });
        const saved = await this.exceptionRepository.save(exc);
        const exType = await this.exceptionTypeRepository.findOne({ where: { id: body.exception_type } });
        const disruptionType = exType?.name ?? `Exception #${body.exception_type}`;
        const flight = await this.flightRepository.findOne({ where: { id: flightId } });
        if (flight) {
            const affectedBps = await this.bookingPassengerRepository.find({
                where: { flight_series_id: flight.series_id, travel_date: flight.flight_date },
                relations: ['booking'],
            });
            const uniqueBookingIds = [...new Set(affectedBps.filter(bp => bp.booking).map(bp => bp.booking_id))];
            if (uniqueBookingIds.length > 0) {
                const disruptions = uniqueBookingIds.map(bookingId => this.disruptionRepository.create({
                    booking_id: bookingId,
                    flight_id: flightId,
                    disruption_type: disruptionType,
                    action_taken: body.action_taken ?? null,
                }));
                await this.disruptionRepository.save(disruptions);
                console.log(`✅ Created ${disruptions.length} passenger disruption records for flight ${flightId}`);
            }
        }
        return this.exceptionRepository.findOne({
            where: { id: saved.id },
            relations: ['exceptionType'],
        });
    }
    async getCrewAssignments(id) {
        return this.crewAssignmentRepository.find({
            where: { flight_id: id },
            relations: ['crew'],
            order: { created_at: 'ASC' },
        });
    }
    async assignCrew(id, body) {
        const assignment = this.crewAssignmentRepository.create({
            flight_id: id,
            crew_id: body.crew_id,
            role: body.role ?? null,
            notes: body.notes ?? null,
        });
        const saved = await this.crewAssignmentRepository.save(assignment);
        return this.crewAssignmentRepository.findOne({
            where: { id: saved.id },
            relations: ['crew'],
        });
    }
    async removeCrewAssignment(flightId, assignmentId) {
        await this.crewAssignmentRepository.delete({ id: assignmentId, flight_id: flightId });
        return { message: 'Removed' };
    }
    async getAllCrew() {
        return this.crewRepository.find({ order: { name: 'ASC' } });
    }
    async getExceptionTypes() {
        return this.exceptionTypeRepository.find({ order: { name: 'ASC' } });
    }
};
exports.FlightsController = FlightsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('seriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/extra'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "addExtraFlight", null);
__decorate([
    (0, common_1.Get)(':id/passengers'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getPassengers", null);
__decorate([
    (0, common_1.Get)(':id/exceptions'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getExceptions", null);
__decorate([
    (0, common_1.Post)(':id/exceptions'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "addException", null);
__decorate([
    (0, common_1.Get)(':id/crew'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getCrewAssignments", null);
__decorate([
    (0, common_1.Post)(':id/crew'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "assignCrew", null);
__decorate([
    (0, common_1.Delete)(':flightId/crew/:assignmentId'),
    __param(0, (0, common_1.Param)('flightId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('assignmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "removeCrewAssignment", null);
__decorate([
    (0, common_1.Get)('crew/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getAllCrew", null);
__decorate([
    (0, common_1.Get)('exception-types/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getExceptionTypes", null);
exports.FlightsController = FlightsController = __decorate([
    (0, common_1.Controller)('admin/flights'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_exception_entity_1.FlightException)),
    __param(2, (0, typeorm_1.InjectRepository)(exception_type_entity_1.ExceptionType)),
    __param(3, (0, typeorm_1.InjectRepository)(passenger_disruption_entity_1.PassengerDisruption)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_passenger_entity_1.BookingPassenger)),
    __param(5, (0, typeorm_1.InjectRepository)(crew_assignment_entity_1.CrewAssignment)),
    __param(6, (0, typeorm_1.InjectRepository)(crew_entity_1.Crew)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlightsController);
//# sourceMappingURL=flights.controller.js.map