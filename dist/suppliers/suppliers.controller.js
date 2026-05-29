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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const suppliers_service_1 = require("./suppliers.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SuppliersController = class SuppliersController {
    suppliersService;
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async findAll(page = 1, limit = 10, search, status) {
        console.log('🔍 [SuppliersController] GET /admin/suppliers', { page, limit, search, status });
        const result = await this.suppliersService.findAll(page, limit, search, status);
        console.log(`✅ [SuppliersController] Returning ${result.suppliers.length} suppliers out of ${result.total} total`);
        return result;
    }
    async getStats() {
        console.log('🔍 [SuppliersController] GET /admin/suppliers/stats');
        const stats = await this.suppliersService.getStats();
        console.log('✅ [SuppliersController] Stats calculated:', stats);
        return stats;
    }
    async searchSuppliers(searchTerm) {
        console.log('🔍 [SuppliersController] GET /admin/suppliers/search', { searchTerm });
        const suppliers = await this.suppliersService.searchSuppliers(searchTerm);
        console.log(`✅ [SuppliersController] Found ${suppliers.length} suppliers for search: ${searchTerm}`);
        return suppliers;
    }
    async findOne(id) {
        console.log(`🔍 [SuppliersController] GET /admin/suppliers/${id}`);
        const supplier = await this.suppliersService.findOne(id);
        console.log(`✅ [SuppliersController] Supplier ${id} found:`, supplier.company_name);
        return supplier;
    }
    async create(createSupplierDto) {
        console.log('🔍 [SuppliersController] POST /admin/suppliers', createSupplierDto);
        const supplier = await this.suppliersService.create(createSupplierDto);
        console.log(`✅ [SuppliersController] Supplier created with ID: ${supplier.id}`);
        return supplier;
    }
    async update(id, updateSupplierDto) {
        console.log(`🔍 [SuppliersController] PUT /admin/suppliers/${id}`, updateSupplierDto);
        const supplier = await this.suppliersService.update(id, updateSupplierDto);
        console.log(`✅ [SuppliersController] Supplier ${id} updated:`, supplier.company_name);
        return supplier;
    }
    async remove(id) {
        console.log(`🔍 [SuppliersController] DELETE /admin/suppliers/${id}`);
        await this.suppliersService.remove(id);
        console.log(`✅ [SuppliersController] Supplier ${id} deleted successfully`);
        return { message: 'Supplier deleted successfully' };
    }
    async getPayablesAging() {
        console.log('🔍 [SuppliersController] GET /admin/suppliers/payables/aging');
        const result = await this.suppliersService.getPayablesAging();
        console.log(`✅ [SuppliersController] Payables aging analysis: ${result.items.length} suppliers`);
        return result;
    }
    async getSupplierInvoicesByAging(supplierId, agingPeriod) {
        console.log(`🔍 [SuppliersController] GET /admin/suppliers/payables/${supplierId}/invoices/${agingPeriod}`);
        const result = await this.suppliersService.getSupplierInvoicesByAging(supplierId, agingPeriod);
        console.log(`✅ [SuppliersController] Found ${result.length} invoices for supplier ${supplierId}`);
        return result;
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "searchSuppliers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('payables/aging'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getPayablesAging", null);
__decorate([
    (0, common_1.Get)('payables/:supplierId/invoices/:agingPeriod'),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('agingPeriod')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getSupplierInvoicesByAging", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, common_1.Controller)('admin/suppliers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map