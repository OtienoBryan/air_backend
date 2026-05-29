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
exports.ChartOfAccountsController = void 0;
const common_1 = require("@nestjs/common");
const chart_of_accounts_service_1 = require("./chart-of-accounts.service");
const create_chart_of_account_dto_1 = require("./dto/create-chart-of-account.dto");
const update_chart_of_account_dto_1 = require("./dto/update-chart-of-account.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ChartOfAccountsController = class ChartOfAccountsController {
    chartOfAccountsService;
    constructor(chartOfAccountsService) {
        this.chartOfAccountsService = chartOfAccountsService;
    }
    async findAll(accountType) {
        console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts');
        console.log('📊 [ChartOfAccountsController] Query params:', { accountType });
        const accountTypeNum = accountType ? parseInt(accountType, 10) : undefined;
        try {
            const result = await this.chartOfAccountsService.findAll(accountTypeNum);
            console.log('📊 [ChartOfAccountsController] Returning all accounts:', result.accounts.length);
            return result;
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsController] Error:', error);
            throw error;
        }
    }
    async findAllAccountTypes() {
        console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/account-types');
        try {
            return await this.chartOfAccountsService.findAllAccountTypes();
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsController] Error in findAllAccountTypes:', error);
            throw error;
        }
    }
    async getTrialBalance(startDate, endDate, accountType) {
        console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/trial-balance');
        console.log('📊 [ChartOfAccountsController] Query params:', { startDate, endDate, accountType });
        if (!startDate || !endDate) {
            throw new Error('start_date and end_date are required');
        }
        const accountTypeNum = accountType ? parseInt(accountType, 10) : undefined;
        try {
            return await this.chartOfAccountsService.getTrialBalance(startDate, endDate, accountTypeNum);
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsController] Error in getTrialBalance:', error);
            throw error;
        }
    }
    async findOne(id) {
        console.log(`📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/${id}`);
        return this.chartOfAccountsService.findOne(id);
    }
    async create(createChartOfAccountDto) {
        console.log('📊 [ChartOfAccountsController] POST /admin/chart-of-accounts');
        console.log('📊 [ChartOfAccountsController] Create data:', JSON.stringify(createChartOfAccountDto, null, 2));
        return this.chartOfAccountsService.create(createChartOfAccountDto);
    }
    async update(id, updateChartOfAccountDto) {
        console.log(`📊 [ChartOfAccountsController] PATCH /admin/chart-of-accounts/${id}`);
        return this.chartOfAccountsService.update(id, updateChartOfAccountDto);
    }
    async remove(id) {
        console.log(`📊 [ChartOfAccountsController] DELETE /admin/chart-of-accounts/${id}`);
        await this.chartOfAccountsService.remove(id);
        return { message: 'Chart of account deleted successfully' };
    }
};
exports.ChartOfAccountsController = ChartOfAccountsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('account_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('account-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "findAllAccountTypes", null);
__decorate([
    (0, common_1.Get)('trial-balance'),
    __param(0, (0, common_1.Query)('start_date')),
    __param(1, (0, common_1.Query)('end_date')),
    __param(2, (0, common_1.Query)('account_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "getTrialBalance", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chart_of_account_dto_1.CreateChartOfAccountDto]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_chart_of_account_dto_1.UpdateChartOfAccountDto]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "remove", null);
exports.ChartOfAccountsController = ChartOfAccountsController = __decorate([
    (0, common_1.Controller)('admin/chart-of-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chart_of_accounts_service_1.ChartOfAccountsService])
], ChartOfAccountsController);
//# sourceMappingURL=chart-of-accounts.controller.js.map