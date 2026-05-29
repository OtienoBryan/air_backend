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
exports.SeatReservationsController = void 0;
const common_1 = require("@nestjs/common");
const seat_reservations_service_1 = require("./seat-reservations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_seat_reservation_dto_1 = require("./dto/create-seat-reservation.dto");
const update_seat_reservation_dto_1 = require("./dto/update-seat-reservation.dto");
let SeatReservationsController = class SeatReservationsController {
    seatReservationsService;
    constructor(seatReservationsService) {
        this.seatReservationsService = seatReservationsService;
    }
    async findAll(page = 1, limit = 50, flightSeriesId) {
        console.log('🎫 [SeatReservationsController] GET /admin/seat-reservations', { page, limit, flightSeriesId });
        return this.seatReservationsService.findAll(page, limit, flightSeriesId);
    }
    async findByFlightSeries(flightSeriesId) {
        console.log(`🎫 [SeatReservationsController] GET /admin/seat-reservations/flight-series/${flightSeriesId}`);
        return this.seatReservationsService.findByFlightSeries(flightSeriesId);
    }
    async findOne(id) {
        console.log(`🎫 [SeatReservationsController] GET /admin/seat-reservations/${id}`);
        return this.seatReservationsService.findOne(id);
    }
    async create(createSeatReservationDto) {
        console.log('🎫 [SeatReservationsController] POST /admin/seat-reservations');
        console.log('🎫 [SeatReservationsController] Create reservation data:', JSON.stringify(createSeatReservationDto, null, 2));
        try {
            const result = await this.seatReservationsService.create(createSeatReservationDto);
            console.log('✅ [SeatReservationsController] Reservation created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [SeatReservationsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateSeatReservationDto) {
        console.log(`🎫 [SeatReservationsController] PUT /admin/seat-reservations/${id}`);
        console.log('🎫 [SeatReservationsController] Update reservation data:', updateSeatReservationDto);
        return this.seatReservationsService.update(id, updateSeatReservationDto);
    }
    async remove(id) {
        console.log(`🎫 [SeatReservationsController] DELETE /admin/seat-reservations/${id}`);
        await this.seatReservationsService.remove(id);
        return { message: 'Seat reservation deleted successfully' };
    }
};
exports.SeatReservationsController = SeatReservationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('flightSeriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('flight-series/:flightSeriesId'),
    __param(0, (0, common_1.Param)('flightSeriesId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "findByFlightSeries", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seat_reservation_dto_1.CreateSeatReservationDto]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_seat_reservation_dto_1.UpdateSeatReservationDto]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeatReservationsController.prototype, "remove", null);
exports.SeatReservationsController = SeatReservationsController = __decorate([
    (0, common_1.Controller)('admin/seat-reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [seat_reservations_service_1.SeatReservationsService])
], SeatReservationsController);
//# sourceMappingURL=seat-reservations.controller.js.map