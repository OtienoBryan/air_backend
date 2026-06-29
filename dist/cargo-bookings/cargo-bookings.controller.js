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
exports.CargoBookingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cargo_bookings_service_1 = require("./cargo-bookings.service");
const create_cargo_booking_dto_1 = require("./dto/create-cargo-booking.dto");
const assign_cargo_flight_dto_1 = require("./dto/assign-cargo-flight.dto");
let CargoBookingsController = class CargoBookingsController {
    cargoBookingsService;
    constructor(cargoBookingsService) {
        this.cargoBookingsService = cargoBookingsService;
    }
    async create(dto) {
        console.log('📦 [CargoBookingsController] POST /admin/cargo-bookings');
        return this.cargoBookingsService.create(dto);
    }
    async findAll(page = 1, limit = 50, flightSeriesId, flightId) {
        console.log('📦 [CargoBookingsController] GET /admin/cargo-bookings', { page, limit, flightSeriesId, flightId });
        const fsId = flightSeriesId ? Number(flightSeriesId) : undefined;
        const fId = flightId ? Number(flightId) : undefined;
        return this.cargoBookingsService.findAll(Number(page) || 1, Number(limit) || 50, fsId, fId);
    }
    async assignFlight(id, dto) {
        console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/assign-flight`, dto);
        return this.cargoBookingsService.assignFlight(id, dto.flight_series_id ?? null);
    }
    async updateStatus(id, body) {
        console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/status`, body);
        return this.cargoBookingsService.updateStatus(id, body.status);
    }
    async updatePrice(id, body) {
        console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/price`, body);
        return this.cargoBookingsService.updatePrice(id, body);
    }
    async recordPayment(id, body) {
        console.log(`📦 [CargoBookingsController] PATCH /admin/cargo-bookings/${id}/payment`, body);
        return this.cargoBookingsService.recordPayment(id, body);
    }
};
exports.CargoBookingsController = CargoBookingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cargo_booking_dto_1.CreateCargoBookingDto]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('flight_series_id')),
    __param(3, (0, common_1.Query)('flight_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/assign-flight'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assign_cargo_flight_dto_1.AssignCargoFlightDto]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "assignFlight", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/price'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Patch)(':id/payment'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CargoBookingsController.prototype, "recordPayment", null);
exports.CargoBookingsController = CargoBookingsController = __decorate([
    (0, common_1.Controller)('admin/cargo-bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cargo_bookings_service_1.CargoBookingsService])
], CargoBookingsController);
//# sourceMappingURL=cargo-bookings.controller.js.map