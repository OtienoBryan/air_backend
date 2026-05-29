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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivableAgingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const receivable_aging_service_1 = require("./receivable-aging.service");
let ReceivableAgingController = class ReceivableAgingController {
    receivableAgingService;
    constructor(receivableAgingService) {
        this.receivableAgingService = receivableAgingService;
    }
    async getReceivableAging() {
        console.log('🔍 [ReceivableAgingController] GET /admin/receivable-aging');
        try {
            const data = await this.receivableAgingService.getReceivableAging();
            console.log(`✅ [ReceivableAgingController] Returning ${data.length} clients with receivables`);
            return data;
        }
        catch (error) {
            console.error('❌ [ReceivableAgingController] Error:', error);
            throw error;
        }
    }
    async getReceivableAgingSummary() {
        console.log('🔍 [ReceivableAgingController] GET /admin/receivable-aging/summary');
        try {
            const summary = await this.receivableAgingService.getReceivableAgingSummary();
            console.log('✅ [ReceivableAgingController] Summary calculated:', summary);
            return summary;
        }
        catch (error) {
            console.error('❌ [ReceivableAgingController] Error calculating summary:', error);
            throw error;
        }
    }
};
exports.ReceivableAgingController = ReceivableAgingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReceivableAgingController.prototype, "getReceivableAging", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReceivableAgingController.prototype, "getReceivableAgingSummary", null);
exports.ReceivableAgingController = ReceivableAgingController = __decorate([
    (0, common_1.Controller)('admin/receivable-aging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [receivable_aging_service_1.ReceivableAgingService])
], ReceivableAgingController);
//# sourceMappingURL=receivable-aging.controller.js.map