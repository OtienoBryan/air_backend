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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_inventory_entity_1 = require("../entities/store-inventory.entity");
let InventoryService = class InventoryService {
    storeInventoryRepository;
    constructor(storeInventoryRepository) {
        this.storeInventoryRepository = storeInventoryRepository;
    }
    async getAllInventory() {
        console.log('🔍 [InventoryService] Getting all inventory...');
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
      ORDER BY s.store_name, p.product_name
    `;
        try {
            console.log('📊 [InventoryService] Executing inventory query...');
            const result = await this.storeInventoryRepository.query(query);
            console.log(`✅ [InventoryService] Successfully retrieved ${result.length} inventory items`);
            console.log('📋 [InventoryService] Sample data:', result.slice(0, 3));
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryService] Error getting inventory:', error);
            throw error;
        }
    }
    async getInventoryByStore(storeId) {
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
      WHERE si.store_id = ?
      ORDER BY p.product_name
    `;
        return await this.storeInventoryRepository.query(query, [storeId]);
    }
    async getInventoryByProduct(productId) {
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
      WHERE si.product_id = ?
      ORDER BY s.store_name
    `;
        return await this.storeInventoryRepository.query(query, [productId]);
    }
    async updateInventoryQuantity(id, quantity) {
        console.log(`🔍 [InventoryService] updateInventoryQuantity called with id=${id}, quantity=${quantity}`);
        try {
            console.log(`🔍 [InventoryService] Looking for inventory item with id=${id}`);
            const inventory = await this.storeInventoryRepository.findOne({ where: { id } });
            if (!inventory) {
                console.error(`❌ [InventoryService] Inventory item not found with id=${id}`);
                throw new Error('Inventory item not found');
            }
            console.log(`📦 [InventoryService] Found inventory item:`, {
                id: inventory.id,
                store_id: inventory.store_id,
                product_id: inventory.product_id,
                current_quantity: inventory.quantity,
                new_quantity: quantity
            });
            inventory.quantity = quantity;
            console.log(`💾 [InventoryService] Saving updated inventory item...`);
            const savedInventory = await this.storeInventoryRepository.save(inventory);
            console.log(`✅ [InventoryService] Successfully saved inventory item:`, savedInventory);
            return savedInventory;
        }
        catch (error) {
            console.error(`❌ [InventoryService] Error in updateInventoryQuantity:`, error);
            throw error;
        }
    }
    async getStores() {
        console.log('🏪 [InventoryService] Getting stores...');
        const query = `
      SELECT id, store_name, store_code, address, country_id, is_active, created_at
      FROM stores 
      WHERE is_active = 1 OR is_active IS NULL
      ORDER BY store_name ASC
    `;
        try {
            console.log('📊 [InventoryService] Executing stores query...');
            const result = await this.storeInventoryRepository.query(query);
            console.log(`✅ [InventoryService] Successfully retrieved ${result.length} stores`);
            console.log('🏪 [InventoryService] Stores data:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryService] Error getting stores:', error);
            throw error;
        }
    }
    async getProducts() {
        console.log('📦 [InventoryService] Getting products...');
        const query = `
      SELECT id, product_name, product_code, category, selling_price, current_stock, is_active, created_at
      FROM products 
      WHERE is_active = 1 OR is_active IS NULL
      ORDER BY product_name ASC
    `;
        try {
            console.log('📊 [InventoryService] Executing products query...');
            const result = await this.storeInventoryRepository.query(query);
            console.log(`✅ [InventoryService] Successfully retrieved ${result.length} products`);
            console.log('📦 [InventoryService] Sample products:', result.slice(0, 3));
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryService] Error getting products:', error);
            throw error;
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_inventory_entity_1.StoreInventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map