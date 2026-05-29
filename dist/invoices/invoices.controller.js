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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const invoices_service_1 = require("./invoices.service");
let InvoicesController = class InvoicesController {
    invoicesService;
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    async getInvoices(page = 1, limit = 10, search, status, myStatus) {
        console.log('🔍 [InvoicesController] GET /admin/invoices', { page, limit, search, status, myStatus });
        const result = await this.invoicesService.getInvoices(page, limit, search, status, myStatus);
        console.log(`✅ [InvoicesController] Returning ${result.invoices.length} invoices out of ${result.total} total`);
        return result;
    }
    async getInvoiceSummary() {
        console.log('🔍 [InvoicesController] GET /admin/invoices/summary');
        const summary = await this.invoicesService.getInvoiceSummary();
        console.log('✅ [InvoicesController] Summary calculated:', summary);
        return summary;
    }
    async getInvoiceById(id) {
        console.log(`🔍 [InvoicesController] GET /admin/invoices/${id}`);
        const invoice = await this.invoicesService.getInvoiceById(id);
        if (invoice) {
            console.log(`✅ [InvoicesController] Invoice ${id} found:`, invoice.soNumber);
        }
        else {
            console.log(`⚠️ [InvoicesController] Invoice ${id} not found`);
        }
        return invoice;
    }
    async getInvoiceOrderItems(id) {
        console.log(`🔍 [InvoicesController] GET /admin/invoices/${id}/order-items`);
        const orderItems = await this.invoicesService.getInvoiceOrderItems(id);
        console.log(`✅ [InvoicesController] Found ${orderItems.length} order items for invoice ${id}`);
        return orderItems;
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('myStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoiceSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.Get)(':id/order-items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoiceOrderItems", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, common_1.Controller)('admin/invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map