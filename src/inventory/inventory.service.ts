import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreInventory } from '../entities/store-inventory.entity';

export interface InventoryItem {
  id: number;
  store_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  store_name: string;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(StoreInventory)
    private storeInventoryRepository: Repository<StoreInventory>,
  ) {}

  async getAllInventory(): Promise<InventoryItem[]> {
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
    } catch (error) {
      console.error('❌ [InventoryService] Error getting inventory:', error);
      throw error;
    }
  }

  async getInventoryByStore(storeId: number): Promise<InventoryItem[]> {
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

  async getInventoryByProduct(productId: number): Promise<InventoryItem[]> {
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

  async updateInventoryQuantity(id: number, quantity: number): Promise<StoreInventory> {
    console.log(`🔍 [InventoryService] updateInventoryQuantity called with id=${id}, quantity=${quantity}`);
    
    try {
      // Find the inventory item
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

      // Update the quantity
      inventory.quantity = quantity;
      console.log(`💾 [InventoryService] Saving updated inventory item...`);
      
      const savedInventory = await this.storeInventoryRepository.save(inventory);
      console.log(`✅ [InventoryService] Successfully saved inventory item:`, savedInventory);
      
      return savedInventory;
    } catch (error) {
      console.error(`❌ [InventoryService] Error in updateInventoryQuantity:`, error);
      throw error;
    }
  }

  async getStores(): Promise<any[]> {
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
    } catch (error) {
      console.error('❌ [InventoryService] Error getting stores:', error);
      throw error;
    }
  }

  async getProducts(): Promise<any[]> {
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
    } catch (error) {
      console.error('❌ [InventoryService] Error getting products:', error);
      throw error;
    }
  }
}
