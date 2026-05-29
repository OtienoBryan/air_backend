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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getAllInventory() {
        console.log('🔍 [InventoryController] GET /inventory - Getting all inventory');
        try {
            const result = await this.inventoryService.getAllInventory();
            console.log(`✅ [InventoryController] Successfully returned ${result.length} inventory items`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryController] Error in getAllInventory:', error);
            throw error;
        }
    }
    async getStores() {
        console.log('🏪 [InventoryController] GET /inventory/stores - Getting stores');
        try {
            const result = await this.inventoryService.getStores();
            console.log(`✅ [InventoryController] Successfully returned ${result.length} stores`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryController] Error in getStores:', error);
            throw error;
        }
    }
    async getProducts() {
        console.log('📦 [InventoryController] GET /inventory/products - Getting products');
        try {
            const result = await this.inventoryService.getProducts();
            console.log(`✅ [InventoryController] Successfully returned ${result.length} products`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryController] Error in getProducts:', error);
            throw error;
        }
    }
    async getInventoryByStore(storeId) {
        return await this.inventoryService.getInventoryByStore(storeId);
    }
    async getInventoryByProduct(productId) {
        return await this.inventoryService.getInventoryByProduct(productId);
    }
    async updateQuantity(id, quantity) {
        console.log(`💾 [InventoryController] PUT /inventory/${id}/quantity - Updating quantity to ${quantity}`);
        try {
            if (quantity < 0) {
                throw new Error('Quantity cannot be negative');
            }
            if (!id || isNaN(id)) {
                throw new Error('Invalid inventory ID');
            }
            console.log(`🔍 [InventoryController] Validating inputs: id=${id}, quantity=${quantity}`);
            const inventory = await this.inventoryService.updateInventoryQuantity(id, quantity);
            console.log(`✅ [InventoryController] Successfully updated inventory:`, inventory);
            return {
                message: 'Inventory quantity updated successfully',
                inventory,
            };
        }
        catch (error) {
            console.error(`❌ [InventoryController] Error updating inventory:`, error);
            throw error;
        }
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllInventory", null);
__decorate([
    (0, common_1.Get)('stores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStores", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('store/:storeId'),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryByStore", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryByProduct", null);
__decorate([
    (0, common_1.Put)(':id/quantity'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateQuantity", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('admin/inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map