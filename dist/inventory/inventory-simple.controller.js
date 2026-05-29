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
exports.InventorySimpleController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let InventorySimpleController = class InventorySimpleController {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getAllInventory() {
        console.log('🔍 [InventorySimpleController] GET /inventory - Getting all inventory');
        try {
            const query = `
        SELECT 
          si.id,
          si.store_id,
          si.product_id,
          si.quantity,
          p.product_name,
          s.store_name
        FROM store_inventory si
        LEFT JOIN products p ON si.product_id = p.id
        LEFT JOIN stores s ON si.store_id = s.id
        ORDER BY si.store_id, p.product_name
      `;
            const result = await this.dataSource.query(query);
            console.log(`✅ [InventorySimpleController] Retrieved ${result.length} inventory items`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventorySimpleController] Error:', error);
            return [];
        }
    }
    async getStores() {
        console.log('🏪 [InventorySimpleController] GET /inventory/stores - Getting stores');
        try {
            const query = `
        SELECT id, store_name, store_code, address, country_id, is_active, created_at
        FROM stores 
        WHERE is_active = 1 OR is_active IS NULL
        ORDER BY store_name ASC
      `;
            const result = await this.dataSource.query(query);
            console.log(`✅ [InventorySimpleController] Retrieved ${result.length} stores`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventorySimpleController] Error getting stores:', error);
            return [];
        }
    }
    async getProducts() {
        console.log('📦 [InventorySimpleController] GET /inventory/products - Getting products');
        try {
            const query = `
        SELECT id, product_name, product_code, category, selling_price, current_stock, is_active, created_at
        FROM products 
        WHERE is_active = 1 OR is_active IS NULL
        ORDER BY product_name ASC
      `;
            const result = await this.dataSource.query(query);
            console.log(`✅ [InventorySimpleController] Retrieved ${result.length} products`);
            return result;
        }
        catch (error) {
            console.error('❌ [InventorySimpleController] Error getting products:', error);
            return [];
        }
    }
};
exports.InventorySimpleController = InventorySimpleController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventorySimpleController.prototype, "getAllInventory", null);
__decorate([
    (0, common_1.Get)('stores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventorySimpleController.prototype, "getStores", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventorySimpleController.prototype, "getProducts", null);
exports.InventorySimpleController = InventorySimpleController = __decorate([
    (0, common_1.Controller)('admin/inventory'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], InventorySimpleController);
//# sourceMappingURL=inventory-simple.controller.js.map