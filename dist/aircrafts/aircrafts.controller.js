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
exports.AircraftsController = void 0;
const common_1 = require("@nestjs/common");
const aircrafts_service_1 = require("./aircrafts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_aircraft_dto_1 = require("./dto/create-aircraft.dto");
const update_aircraft_dto_1 = require("./dto/update-aircraft.dto");
let AircraftsController = class AircraftsController {
    aircraftsService;
    constructor(aircraftsService) {
        this.aircraftsService = aircraftsService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('✈️ [AircraftsController] GET /admin/aircrafts', { page, limit });
        return this.aircraftsService.findAll(page, limit);
    }
    async findOne(id) {
        console.log(`✈️ [AircraftsController] GET /admin/aircrafts/${id}`);
        return this.aircraftsService.findOne(id);
    }
    async create(createAircraftDto) {
        console.log('✈️ [AircraftsController] POST /admin/aircrafts');
        console.log('✈️ [AircraftsController] Create aircraft data:', JSON.stringify(createAircraftDto, null, 2));
        try {
            const result = await this.aircraftsService.create(createAircraftDto);
            console.log('✅ [AircraftsController] Aircraft created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [AircraftsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateAircraftDto) {
        console.log(`✈️ [AircraftsController] PUT /admin/aircrafts/${id}`);
        console.log('✈️ [AircraftsController] Update aircraft data:', updateAircraftDto);
        return this.aircraftsService.update(id, updateAircraftDto);
    }
    async remove(id) {
        console.log(`✈️ [AircraftsController] DELETE /admin/aircrafts/${id}`);
        await this.aircraftsService.remove(id);
        return { message: 'Aircraft deleted successfully' };
    }
};
exports.AircraftsController = AircraftsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AircraftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AircraftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aircraft_dto_1.CreateAircraftDto]),
    __metadata("design:returntype", Promise)
], AircraftsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_aircraft_dto_1.UpdateAircraftDto]),
    __metadata("design:returntype", Promise)
], AircraftsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AircraftsController.prototype, "remove", null);
exports.AircraftsController = AircraftsController = __decorate([
    (0, common_1.Controller)('admin/aircrafts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [aircrafts_service_1.AircraftsService])
], AircraftsController);
//# sourceMappingURL=aircrafts.controller.js.map