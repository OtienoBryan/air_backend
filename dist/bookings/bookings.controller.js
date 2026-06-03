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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async create(createBookingDto) {
        console.log('🎫 [BookingsController] POST /admin/bookings');
        console.log('🎫 [BookingsController] Create booking data:', JSON.stringify(createBookingDto, null, 2));
        try {
            const result = await this.bookingsService.create(createBookingDto);
            console.log('✅ [BookingsController] Booking created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [BookingsController] Error in create:', error);
            throw error;
        }
    }
    async findAll(page = 1, limit = 50) {
        console.log('🎫 [BookingsController] GET /admin/bookings', { page, limit });
        return this.bookingsService.findAll(page, limit);
    }
    async getSeatCounts(flightSeriesId) {
        return this.bookingsService.getBookedSeatCounts(Number(flightSeriesId));
    }
    async getPassengersByFlight(flightSeriesId) {
        return this.bookingsService.getPassengersByFlight(Number(flightSeriesId));
    }
    async findOne(id) {
        console.log(`🎫 [BookingsController] GET /admin/bookings/${id}`);
        return this.bookingsService.findOne(id);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('seat-counts'),
    __param(0, (0, common_1.Query)('flightSeriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getSeatCounts", null);
__decorate([
    (0, common_1.Get)('passengers-by-flight'),
    __param(0, (0, common_1.Query)('flightSeriesId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getPassengersByFlight", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOne", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('admin/bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map