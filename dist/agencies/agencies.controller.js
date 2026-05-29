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
exports.AgenciesController = void 0;
const common_1 = require("@nestjs/common");
const agencies_service_1 = require("./agencies.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_agency_dto_1 = require("./dto/create-agency.dto");
const update_agency_dto_1 = require("./dto/update-agency.dto");
const create_deposit_dto_1 = require("./dto/create-deposit.dto");
let AgenciesController = class AgenciesController {
    agenciesService;
    constructor(agenciesService) {
        this.agenciesService = agenciesService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('🏢 [AgenciesController] GET /admin/agencies', { page, limit });
        return this.agenciesService.findAll(page, limit);
    }
    async findOne(id) {
        console.log(`🏢 [AgenciesController] GET /admin/agencies/${id}`);
        return this.agenciesService.findOne(id);
    }
    async create(createAgencyDto) {
        console.log('🏢 [AgenciesController] POST /admin/agencies');
        console.log('🏢 [AgenciesController] Create agency data:', JSON.stringify(createAgencyDto, null, 2));
        try {
            const result = await this.agenciesService.create(createAgencyDto);
            console.log('✅ [AgenciesController] Agency created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [AgenciesController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateAgencyDto) {
        console.log(`🏢 [AgenciesController] PUT /admin/agencies/${id}`);
        console.log('🏢 [AgenciesController] Update agency data:', updateAgencyDto);
        return this.agenciesService.update(id, updateAgencyDto);
    }
    async remove(id) {
        console.log(`🏢 [AgenciesController] DELETE /admin/agencies/${id}`);
        await this.agenciesService.remove(id);
        return { message: 'Agency deleted successfully' };
    }
    async getBalance(id) {
        console.log(`💰 [AgenciesController] GET /admin/agencies/${id}/balance`);
        const balance = await this.agenciesService.getAgencyBalance(id);
        return { balance };
    }
    async getLedger(id) {
        console.log(`📋 [AgenciesController] GET /admin/agencies/${id}/ledger`);
        return this.agenciesService.getAgencyLedger(id);
    }
    async findAllWithBalance() {
        console.log('🏢 [AgenciesController] GET /admin/agencies/all/with-balance');
        return this.agenciesService.findAllWithBalance();
    }
    async createDeposit(id, createDepositDto) {
        console.log(`💰 [AgenciesController] POST /admin/agencies/${id}/deposit`);
        console.log('💰 [AgenciesController] Deposit data:', JSON.stringify(createDepositDto, null, 2));
        return this.agenciesService.createDeposit(id, createDepositDto);
    }
    async findAllDeposits(page = 1, limit = 50) {
        console.log('💰 [AgenciesController] GET /admin/agencies/deposits/all', { page, limit });
        return this.agenciesService.findAllDeposits(page, limit);
    }
};
exports.AgenciesController = AgenciesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agency_dto_1.CreateAgencyDto]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_agency_dto_1.UpdateAgencyDto]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)(':id/ledger'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Get)('all/with-balance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findAllWithBalance", null);
__decorate([
    (0, common_1.Post)(':id/deposit'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_deposit_dto_1.CreateDepositDto]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "createDeposit", null);
__decorate([
    (0, common_1.Get)('deposits/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AgenciesController.prototype, "findAllDeposits", null);
exports.AgenciesController = AgenciesController = __decorate([
    (0, common_1.Controller)('admin/agencies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [agencies_service_1.AgenciesService])
], AgenciesController);
//# sourceMappingURL=agencies.controller.js.map