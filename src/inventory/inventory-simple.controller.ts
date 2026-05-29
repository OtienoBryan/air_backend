import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('admin/inventory')
export class InventorySimpleController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  
  @Get()
  async getAllInventory(): Promise<any[]> {
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
    } catch (error) {
      console.error('❌ [InventorySimpleController] Error:', error);
      return [];
    }
  }

  @Get('stores')
  async getStores(): Promise<any[]> {
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
    } catch (error) {
      console.error('❌ [InventorySimpleController] Error getting stores:', error);
      return [];
    }
  }

  @Get('products')
  async getProducts(): Promise<any[]> {
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
    } catch (error) {
      console.error('❌ [InventorySimpleController] Error getting products:', error);
      return [];
    }
  }
}
