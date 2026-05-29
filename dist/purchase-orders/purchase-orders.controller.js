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
exports.PurchaseOrdersController = void 0;
const common_1 = require("@nestjs/common");
const purchase_orders_service_1 = require("./purchase-orders.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PurchaseOrdersController = class PurchaseOrdersController {
    purchaseOrdersService;
    constructor(purchaseOrdersService) {
        this.purchaseOrdersService = purchaseOrdersService;
    }
    async findAll(page = 1, limit = 10, search, status, supplierId, startDate, endDate) {
        console.log('🔍 [PurchaseOrdersController] GET /admin/purchase-orders', {
            page, limit, search, status, supplierId, startDate, endDate
        });
        const result = await this.purchaseOrdersService.findAll(page, limit, search, status, supplierId, startDate, endDate);
        console.log(`✅ [PurchaseOrdersController] Returning ${result.purchaseOrders.length} purchase orders out of ${result.total} total`);
        return result;
    }
    async getStats() {
        console.log('🔍 [PurchaseOrdersController] GET /admin/purchase-orders/stats');
        const stats = await this.purchaseOrdersService.getStats();
        console.log('✅ [PurchaseOrdersController] Stats calculated:', stats);
        return stats;
    }
    async getBySupplier(supplierId) {
        console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/supplier/${supplierId}`);
        const orders = await this.purchaseOrdersService.findBySupplier(supplierId);
        console.log(`✅ [PurchaseOrdersController] Found ${orders.length} orders for supplier ${supplierId}`);
        return orders;
    }
    async getSupplierStats(supplierId) {
        console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/supplier/${supplierId}/stats`);
        const stats = await this.purchaseOrdersService.getSupplierStats(supplierId);
        console.log(`✅ [PurchaseOrdersController] Supplier stats calculated for supplier ${supplierId}:`, stats);
        return stats;
    }
    async findOne(id) {
        console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/${id}`);
        const purchaseOrder = await this.purchaseOrdersService.findOne(id);
        console.log(`✅ [PurchaseOrdersController] Purchase order ${id} found:`, purchaseOrder.po_number);
        return purchaseOrder;
    }
    async create(createPurchaseOrderDto) {
        console.log('🔍 [PurchaseOrdersController] POST /admin/purchase-orders', createPurchaseOrderDto);
        const purchaseOrder = await this.purchaseOrdersService.create(createPurchaseOrderDto);
        console.log(`✅ [PurchaseOrdersController] Purchase order created with ID: ${purchaseOrder.id}`);
        return purchaseOrder;
    }
    async update(id, updatePurchaseOrderDto) {
        console.log(`🔍 [PurchaseOrdersController] PUT /admin/purchase-orders/${id}`, updatePurchaseOrderDto);
        const purchaseOrder = await this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
        console.log(`✅ [PurchaseOrdersController] Purchase order ${id} updated:`, purchaseOrder.po_number);
        return purchaseOrder;
    }
    async remove(id) {
        console.log(`🔍 [PurchaseOrdersController] DELETE /admin/purchase-orders/${id}`);
        await this.purchaseOrdersService.remove(id);
        console.log(`✅ [PurchaseOrdersController] Purchase order ${id} deleted successfully`);
        return { message: 'Purchase order deleted successfully' };
    }
    async getPurchaseOrderItems(id) {
        console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/${id}/items`);
        const items = await this.purchaseOrdersService.getPurchaseOrderItems(id);
        console.log(`✅ [PurchaseOrdersController] Found ${items.length} items for purchase order ${id}`);
        return items;
    }
    async createPurchaseOrderWithItems(createData) {
        console.log('🔍 [PurchaseOrdersController] POST /admin/purchase-orders/create-with-items', createData);
        const purchaseOrder = await this.purchaseOrdersService.createPurchaseOrderWithItems(createData);
        console.log(`✅ [PurchaseOrdersController] Purchase order created with items, ID: ${purchaseOrder.id}`);
        return purchaseOrder;
    }
};
exports.PurchaseOrdersController = PurchaseOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('supplierId')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Number, String, String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId'),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getBySupplier", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId/stats'),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getSupplierStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "getPurchaseOrderItems", null);
__decorate([
    (0, common_1.Post)('create-with-items'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "createPurchaseOrderWithItems", null);
exports.PurchaseOrdersController = PurchaseOrdersController = __decorate([
    (0, common_1.Controller)('admin/purchase-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [purchase_orders_service_1.PurchaseOrdersService])
], PurchaseOrdersController);
//# sourceMappingURL=purchase-orders.controller.js.map