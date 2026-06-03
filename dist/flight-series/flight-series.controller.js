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
exports.FlightSeriesController = void 0;
const common_1 = require("@nestjs/common");
const flight_series_service_1 = require("./flight-series.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_flight_series_dto_1 = require("./dto/create-flight-series.dto");
const update_flight_series_dto_1 = require("./dto/update-flight-series.dto");
let FlightSeriesController = class FlightSeriesController {
    flightSeriesService;
    constructor(flightSeriesService) {
        this.flightSeriesService = flightSeriesService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('✈️ [FlightSeriesController] GET /admin/flight-series', { page, limit });
        return this.flightSeriesService.findAll(page, limit);
    }
    async findOne(id) {
        console.log(`✈️ [FlightSeriesController] GET /admin/flight-series/${id}`);
        return this.flightSeriesService.findOne(id);
    }
    async create(createFlightSeriesDto) {
        console.log('✈️ [FlightSeriesController] POST /admin/flight-series');
        console.log('✈️ [FlightSeriesController] Create flight series data:', JSON.stringify(createFlightSeriesDto, null, 2));
        try {
            const result = await this.flightSeriesService.create(createFlightSeriesDto);
            console.log('✅ [FlightSeriesController] Flight series created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [FlightSeriesController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateFlightSeriesDto) {
        console.log(`✈️ [FlightSeriesController] PUT /admin/flight-series/${id}`);
        console.log('✈️ [FlightSeriesController] Update flight series data:', updateFlightSeriesDto);
        return this.flightSeriesService.update(id, updateFlightSeriesDto);
    }
    async remove(id) {
        console.log(`✈️ [FlightSeriesController] DELETE /admin/flight-series/${id}`);
        await this.flightSeriesService.remove(id);
        return { message: 'Flight series deleted successfully' };
    }
    async assignCrew(id, crewId) {
        console.log(`✈️ [FlightSeriesController] POST /admin/flight-series/${id}/crew/${crewId}`);
        await this.flightSeriesService.assignCrew(id, crewId);
        return { message: 'Crew assigned successfully' };
    }
    async removeCrew(id, crewId) {
        console.log(`✈️ [FlightSeriesController] DELETE /admin/flight-series/${id}/crew/${crewId}`);
        await this.flightSeriesService.removeCrew(id, crewId);
        return { message: 'Crew removed successfully' };
    }
    async getCrewAssignments(id) {
        console.log(`✈️ [FlightSeriesController] GET /admin/flight-series/${id}/crew`);
        return this.flightSeriesService.getCrewAssignments(id);
    }
    async getFlightInstances(id, from, to) {
        return this.flightSeriesService.getFlightInstances(id, from, to);
    }
    async regenerateFlightInstances(id) {
        const count = await this.flightSeriesService.regenerateFlightInstances(id);
        return { message: `Generated ${count} flight instances`, count };
    }
};
exports.FlightSeriesController = FlightSeriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_flight_series_dto_1.CreateFlightSeriesDto]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_flight_series_dto_1.UpdateFlightSeriesDto]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/crew/:crewId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('crewId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "assignCrew", null);
__decorate([
    (0, common_1.Delete)(':id/crew/:crewId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('crewId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "removeCrew", null);
__decorate([
    (0, common_1.Get)(':id/crew'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "getCrewAssignments", null);
__decorate([
    (0, common_1.Get)(':id/flights'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "getFlightInstances", null);
__decorate([
    (0, common_1.Post)(':id/flights/regenerate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightSeriesController.prototype, "regenerateFlightInstances", null);
exports.FlightSeriesController = FlightSeriesController = __decorate([
    (0, common_1.Controller)('admin/flight-series'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [flight_series_service_1.FlightSeriesService])
], FlightSeriesController);
//# sourceMappingURL=flight-series.controller.js.map