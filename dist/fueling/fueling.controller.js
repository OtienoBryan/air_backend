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
exports.FuelingController = void 0;
const common_1 = require("@nestjs/common");
const fueling_service_1 = require("./fueling.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_fueling_dto_1 = require("./dto/create-fueling.dto");
let FuelingController = class FuelingController {
    fuelingService;
    constructor(fuelingService) {
        this.fuelingService = fuelingService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('⛽ [FuelingController] GET /admin/fueling', { page, limit });
        const result = await this.fuelingService.findAll(page, limit);
        console.log(`✅ [FuelingController] Returning ${result.fuelings.length} fuelings out of ${result.total} total`);
        return result;
    }
    async findOne(id) {
        console.log(`⛽ [FuelingController] GET /admin/fueling/${id}`);
        const fueling = await this.fuelingService.findOne(id);
        console.log(`✅ [FuelingController] Fueling ${id} found`);
        return fueling;
    }
    async create(createFuelingDto, req) {
        console.log('⛽ [FuelingController] POST /admin/fueling');
        console.log('⛽ [FuelingController] Create fueling data:', JSON.stringify(createFuelingDto, null, 2));
        console.log('⛽ [FuelingController] User ID:', req.user?.sub);
        try {
            const createdBy = req.user?.sub ? Number(req.user.sub) : null;
            const result = await this.fuelingService.create(createFuelingDto, createdBy);
            console.log('✅ [FuelingController] Fueling created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [FuelingController] Error in create:', error);
            throw error;
        }
    }
};
exports.FuelingController = FuelingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FuelingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FuelingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fueling_dto_1.CreateFuelingDto, Object]),
    __metadata("design:returntype", Promise)
], FuelingController.prototype, "create", null);
exports.FuelingController = FuelingController = __decorate([
    (0, common_1.Controller)('admin/fueling'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [fueling_service_1.FuelingService])
], FuelingController);
//# sourceMappingURL=fueling.controller.js.map