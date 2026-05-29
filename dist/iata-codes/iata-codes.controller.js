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
exports.IataCodesController = void 0;
const common_1 = require("@nestjs/common");
const iata_codes_service_1 = require("./iata-codes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_iata_code_dto_1 = require("./dto/create-iata-code.dto");
const update_iata_code_dto_1 = require("./dto/update-iata-code.dto");
let IataCodesController = class IataCodesController {
    iataCodesService;
    constructor(iataCodesService) {
        this.iataCodesService = iataCodesService;
    }
    async findAll(page = 1, limit = 50, search) {
        try {
            console.log('✈️  [IataCodesController] GET /admin/iata-codes', { page, limit, search, types: { page: typeof page, limit: typeof limit } });
            const result = await this.iataCodesService.findAll(page, limit, search);
            console.log('✅ [IataCodesController] Successfully fetched IATA codes:', { total: result.total, returned: result.iataCodes.length });
            return result;
        }
        catch (error) {
            console.error('❌ [IataCodesController] Error in findAll:', error);
            console.error('❌ [IataCodesController] Error message:', error.message);
            console.error('❌ [IataCodesController] Error stack:', error.stack);
            throw error;
        }
    }
    async findByCode(code) {
        console.log(`✈️  [IataCodesController] GET /admin/iata-codes/code/${code}`);
        return this.iataCodesService.findByCode(code);
    }
    async findOne(id) {
        console.log(`✈️  [IataCodesController] GET /admin/iata-codes/${id}`);
        return this.iataCodesService.findOne(id);
    }
    async create(createIataCodeDto) {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes');
        console.log('✈️  [IataCodesController] Create IATA code data:', JSON.stringify(createIataCodeDto, null, 2));
        try {
            const result = await this.iataCodesService.create(createIataCodeDto);
            console.log('✅ [IataCodesController] IATA code created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [IataCodesController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateIataCodeDto) {
        console.log(`✈️  [IataCodesController] PUT /admin/iata-codes/${id}`);
        console.log('✈️  [IataCodesController] Update IATA code data:', updateIataCodeDto);
        return this.iataCodesService.update(id, updateIataCodeDto);
    }
    async remove(id) {
        console.log(`✈️  [IataCodesController] DELETE /admin/iata-codes/${id}`);
        await this.iataCodesService.remove(id);
        return { message: 'IATA code deleted successfully' };
    }
    async bulkInsert(iataCodes) {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes/bulk');
        console.log('✈️  [IataCodesController] Bulk insert IATA codes:', iataCodes.length);
        try {
            const result = await this.iataCodesService.bulkInsert(iataCodes);
            console.log('✅ [IataCodesController] Bulk insert completed:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [IataCodesController] Error in bulk insert:', error);
            throw error;
        }
    }
    async fetchFromInternet() {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes/fetch-from-internet');
        try {
            const result = await this.iataCodesService.fetchFromInternet();
            console.log('✅ [IataCodesController] Internet fetch completed:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [IataCodesController] Error fetching from internet:', error);
            throw error;
        }
    }
};
exports.IataCodesController = IataCodesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_iata_code_dto_1.CreateIataCodeDto]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_iata_code_dto_1.UpdateIataCodeDto]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "bulkInsert", null);
__decorate([
    (0, common_1.Post)('fetch-from-internet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IataCodesController.prototype, "fetchFromInternet", null);
exports.IataCodesController = IataCodesController = __decorate([
    (0, common_1.Controller)('admin/iata-codes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [iata_codes_service_1.IataCodesService])
], IataCodesController);
//# sourceMappingURL=iata-codes.controller.js.map