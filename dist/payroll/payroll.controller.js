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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const create_payroll_dto_1 = require("./dto/create-payroll.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async findAll(page = 1, limit = 50) {
        return this.payrollService.findAll(page, limit);
    }
    async create(createPayrollDto, req) {
        console.log('💼 [PayrollController] POST /admin/payroll');
        console.log('💼 [PayrollController] Create payroll data:', JSON.stringify(createPayrollDto, null, 2));
        console.log('💼 [PayrollController] User ID:', req.user?.sub);
        try {
            const createdBy = req.user?.sub ? Number(req.user.sub) : null;
            const result = await this.payrollService.create(createPayrollDto, createdBy);
            console.log('✅ [PayrollController] Payroll created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [PayrollController] Error in create:', error);
            throw error;
        }
    }
    async findOne(id) {
        return this.payrollService.findOne(id);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.CreatePayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findOne", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('admin/payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map