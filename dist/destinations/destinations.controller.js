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
exports.DestinationsController = void 0;
const common_1 = require("@nestjs/common");
const destinations_service_1 = require("./destinations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_destination_dto_1 = require("./dto/create-destination.dto");
const update_destination_dto_1 = require("./dto/update-destination.dto");
let DestinationsController = class DestinationsController {
    destinationsService;
    constructor(destinationsService) {
        this.destinationsService = destinationsService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('🌍 [DestinationsController] GET /admin/destinations', { page, limit });
        return this.destinationsService.findAll(page, limit);
    }
    async findOne(id) {
        console.log(`🌍 [DestinationsController] GET /admin/destinations/${id}`);
        return this.destinationsService.findOne(id);
    }
    async create(createDestinationDto) {
        console.log('🌍 [DestinationsController] POST /admin/destinations');
        console.log('🌍 [DestinationsController] Create destination data:', JSON.stringify(createDestinationDto, null, 2));
        try {
            const result = await this.destinationsService.create(createDestinationDto);
            console.log('✅ [DestinationsController] Destination created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [DestinationsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateDestinationDto) {
        console.log(`🌍 [DestinationsController] PUT /admin/destinations/${id}`);
        console.log('🌍 [DestinationsController] Update destination data:', updateDestinationDto);
        return this.destinationsService.update(id, updateDestinationDto);
    }
    async remove(id) {
        console.log(`🌍 [DestinationsController] DELETE /admin/destinations/${id}`);
        await this.destinationsService.remove(id);
        return { message: 'Destination deleted successfully' };
    }
};
exports.DestinationsController = DestinationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DestinationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DestinationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_destination_dto_1.CreateDestinationDto]),
    __metadata("design:returntype", Promise)
], DestinationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_destination_dto_1.UpdateDestinationDto]),
    __metadata("design:returntype", Promise)
], DestinationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DestinationsController.prototype, "remove", null);
exports.DestinationsController = DestinationsController = __decorate([
    (0, common_1.Controller)('admin/destinations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [destinations_service_1.DestinationsService])
], DestinationsController);
//# sourceMappingURL=destinations.controller.js.map