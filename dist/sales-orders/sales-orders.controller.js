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
exports.SalesOrdersController = void 0;
const common_1 = require("@nestjs/common");
const sales_orders_service_1 = require("./sales-orders.service");
let SalesOrdersController = class SalesOrdersController {
    salesOrdersService;
    constructor(salesOrdersService) {
        this.salesOrdersService = salesOrdersService;
    }
    async getSalesAnalytics(year) {
        return this.salesOrdersService.getSalesAnalytics(year);
    }
    async getAllClientSalesData(year) {
        return this.salesOrdersService.getAllClientSalesData(year);
    }
    async getClientSalesData(clientId, year) {
        return this.salesOrdersService.getClientSalesData(clientId, year);
    }
    async getBulkClientSalesData(body) {
        return this.salesOrdersService.getBulkClientSalesData(body.clientIds, body.year);
    }
    async getSalesOrders(year, limit, offset) {
        return this.salesOrdersService.getSalesOrders(year, limit, offset);
    }
    async getAllClients() {
        return this.salesOrdersService.getAllClients();
    }
    async getClientSalesDataById(clientId, year) {
        return this.salesOrdersService.getClientSalesData(clientId, year);
    }
    async getClientOrderItems(clientId, year, month) {
        console.log(`🔍 [Controller getClientOrderItems] Received request for clientId: ${clientId}, year: ${year}, month: ${month}`);
        try {
            const result = await this.salesOrdersService.getClientOrderItems(clientId, year, month);
            console.log(`✅ [Controller getClientOrderItems] Service returned ${result.length} items`);
            return result;
        }
        catch (error) {
            console.error(`❌ [Controller getClientOrderItems] Service error:`, error);
            throw error;
        }
    }
    async getProductPerformance(year) {
        console.log(`🔍 [Controller getProductPerformance] Request received for year: ${year}`);
        try {
            const result = await this.salesOrdersService.getProductPerformance(year);
            console.log(`✅ [Controller getProductPerformance] Returning ${result.length} products`);
            return result;
        }
        catch (error) {
            console.error(`❌ [Controller getProductPerformance] Service error:`, error);
            throw error;
        }
    }
    async getProductPerformanceSummary(year) {
        console.log(`🔍 [Controller getProductPerformanceSummary] Request received for year: ${year}`);
        try {
            const result = await this.salesOrdersService.getProductPerformanceSummary(year);
            console.log(`✅ [Controller getProductPerformanceSummary] Returning summary data`);
            return result;
        }
        catch (error) {
            console.error(`❌ [Controller getProductPerformanceSummary] Service error:`, error);
            throw error;
        }
    }
};
exports.SalesOrdersController = SalesOrdersController;
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getSalesAnalytics", null);
__decorate([
    (0, common_1.Get)('clients'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getAllClientSalesData", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getClientSalesData", null);
__decorate([
    (0, common_1.Post)('bulk-sales-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getBulkClientSalesData", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getSalesOrders", null);
__decorate([
    (0, common_1.Get)('clients-list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getAllClients", null);
__decorate([
    (0, common_1.Get)('client/:id/sales'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getClientSalesDataById", null);
__decorate([
    (0, common_1.Get)('client/:clientId/order-items'),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getClientOrderItems", null);
__decorate([
    (0, common_1.Get)('products/performance'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getProductPerformance", null);
__decorate([
    (0, common_1.Get)('products/performance/summary'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesOrdersController.prototype, "getProductPerformanceSummary", null);
exports.SalesOrdersController = SalesOrdersController = __decorate([
    (0, common_1.Controller)('admin/sales'),
    __metadata("design:paramtypes", [sales_orders_service_1.SalesOrdersService])
], SalesOrdersController);
//# sourceMappingURL=sales-orders.controller.js.map