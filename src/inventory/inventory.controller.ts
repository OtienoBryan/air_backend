import { Controller, Get, Param, Put, Body, Query } from '@nestjs/common';
import { InventoryService, InventoryItem } from './inventory.service';

@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAllInventory(): Promise<InventoryItem[]> {
    console.log('🔍 [InventoryController] GET /inventory - Getting all inventory');
    try {
      const result = await this.inventoryService.getAllInventory();
      console.log(`✅ [InventoryController] Successfully returned ${result.length} inventory items`);
      return result;
    } catch (error) {
      console.error('❌ [InventoryController] Error in getAllInventory:', error);
      throw error;
    }
  }

  @Get('stores')
  async getStores(): Promise<any[]> {
    console.log('🏪 [InventoryController] GET /inventory/stores - Getting stores');
    try {
      const result = await this.inventoryService.getStores();
      console.log(`✅ [InventoryController] Successfully returned ${result.length} stores`);
      return result;
    } catch (error) {
      console.error('❌ [InventoryController] Error in getStores:', error);
      throw error;
    }
  }

  @Get('products')
  async getProducts(): Promise<any[]> {
    console.log('📦 [InventoryController] GET /inventory/products - Getting products');
    try {
      const result = await this.inventoryService.getProducts();
      console.log(`✅ [InventoryController] Successfully returned ${result.length} products`);
      return result;
    } catch (error) {
      console.error('❌ [InventoryController] Error in getProducts:', error);
      throw error;
    }
  }

  @Get('store/:storeId')
  async getInventoryByStore(@Param('storeId') storeId: number): Promise<InventoryItem[]> {
    return await this.inventoryService.getInventoryByStore(storeId);
  }

  @Get('product/:productId')
  async getInventoryByProduct(@Param('productId') productId: number): Promise<InventoryItem[]> {
    return await this.inventoryService.getInventoryByProduct(productId);
  }

  @Put(':id/quantity')
  async updateQuantity(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
  ): Promise<{ message: string; inventory: any }> {
    console.log(`💾 [InventoryController] PUT /inventory/${id}/quantity - Updating quantity to ${quantity}`);
    
    try {
      // Validate input
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
    } catch (error) {
      console.error(`❌ [InventoryController] Error updating inventory:`, error);
      throw error;
    }
  }
}
