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
exports.ChartOfAccountsController = exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ExpensesController = class ExpensesController {
    expensesService;
    chartOfAccountRepository;
    constructor(expensesService, chartOfAccountRepository) {
        this.expensesService = expensesService;
        this.chartOfAccountRepository = chartOfAccountRepository;
    }
    async findAll(page = 1, limit = 50) {
        console.log('💰 [ExpensesController] GET /admin/expenses', { page, limit });
        return this.expensesService.findAll(page, limit);
    }
    async create(createExpenseDto, req) {
        console.log('💰 [ExpensesController] POST /admin/expenses');
        console.log('💰 [ExpensesController] Create expense data:', JSON.stringify(createExpenseDto, null, 2));
        console.log('💰 [ExpensesController] User ID:', req.user?.sub);
        try {
            const createdBy = req.user?.sub ? Number(req.user.sub) : null;
            const result = await this.expensesService.create(createExpenseDto, createdBy);
            console.log('✅ [ExpensesController] Expense created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [ExpensesController] Error in create:', error);
            throw error;
        }
    }
    async updatePayment(id, updateExpenseDto) {
        console.log(`💰 [ExpensesController] PATCH /admin/expenses/${id}/payment`);
        console.log('💰 [ExpensesController] Update payment data:', JSON.stringify(updateExpenseDto, null, 2));
        try {
            const result = await this.expensesService.updatePayment(id, updateExpenseDto);
            console.log(`✅ [ExpensesController] Payment updated successfully for expense ${id}`);
            return result;
        }
        catch (error) {
            console.error('❌ [ExpensesController] Error in updatePayment:', error);
            throw error;
        }
    }
    async getPaymentHistory(id) {
        console.log(`💰 [ExpensesController] GET /admin/expenses/${id}/payment-history`);
        try {
            const result = await this.expensesService.getPaymentHistory(id);
            console.log(`✅ [ExpensesController] Payment history retrieved for expense ${id}: ${result.length} entries`);
            return result;
        }
        catch (error) {
            console.error('❌ [ExpensesController] Error in getPaymentHistory:', error);
            throw error;
        }
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/payment'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Get)(':id/payment-history'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getPaymentHistory", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.Controller)('admin/expenses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService,
        typeorm_2.Repository])
], ExpensesController);
let ChartOfAccountsController = class ChartOfAccountsController {
    chartOfAccountRepository;
    constructor(chartOfAccountRepository) {
        this.chartOfAccountRepository = chartOfAccountRepository;
    }
    async findByType(accountType) {
        console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts', { accountType });
        if (accountType !== undefined) {
            const accounts = await this.chartOfAccountRepository.find({
                where: { account_type: accountType },
                order: { name: 'ASC' },
            });
            console.log(`✅ [ChartOfAccountsController] Found ${accounts.length} accounts with type ${accountType}`);
            return accounts;
        }
        const allAccounts = await this.chartOfAccountRepository.find({
            order: { name: 'ASC' },
        });
        console.log(`✅ [ChartOfAccountsController] Found ${allAccounts.length} accounts`);
        return allAccounts;
    }
};
exports.ChartOfAccountsController = ChartOfAccountsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('account_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChartOfAccountsController.prototype, "findByType", null);
exports.ChartOfAccountsController = ChartOfAccountsController = __decorate([
    (0, common_1.Controller)('admin/chart-of-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChartOfAccountsController);
//# sourceMappingURL=expenses.controller.js.map