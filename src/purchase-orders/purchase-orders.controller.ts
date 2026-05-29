import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe, 
  Query,
  UseGuards 
} from '@nestjs/common';
import { PurchaseOrdersService, PurchaseOrderStats } from './purchase-orders.service';
import type { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './purchase-orders.service';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/purchase-orders')
@UseGuards(JwtAuthGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ purchaseOrders: PurchaseOrder[], total: number }> {
    console.log('🔍 [PurchaseOrdersController] GET /admin/purchase-orders', { 
      page, limit, search, status, supplierId, startDate, endDate 
    });
    
    const result = await this.purchaseOrdersService.findAll(
      page, limit, search, status, supplierId, startDate, endDate
    );
    
    console.log(`✅ [PurchaseOrdersController] Returning ${result.purchaseOrders.length} purchase orders out of ${result.total} total`);
    return result;
  }

  @Get('stats')
  async getStats(): Promise<PurchaseOrderStats> {
    console.log('🔍 [PurchaseOrdersController] GET /admin/purchase-orders/stats');
    
    const stats = await this.purchaseOrdersService.getStats();
    
    console.log('✅ [PurchaseOrdersController] Stats calculated:', stats);
    return stats;
  }

  @Get('supplier/:supplierId')
  async getBySupplier(@Param('supplierId', ParseIntPipe) supplierId: number): Promise<PurchaseOrder[]> {
    console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/supplier/${supplierId}`);
    
    const orders = await this.purchaseOrdersService.findBySupplier(supplierId);
    
    console.log(`✅ [PurchaseOrdersController] Found ${orders.length} orders for supplier ${supplierId}`);
    return orders;
  }

  @Get('supplier/:supplierId/stats')
  async getSupplierStats(@Param('supplierId', ParseIntPipe) supplierId: number) {
    console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/supplier/${supplierId}/stats`);
    
    const stats = await this.purchaseOrdersService.getSupplierStats(supplierId);
    
    console.log(`✅ [PurchaseOrdersController] Supplier stats calculated for supplier ${supplierId}:`, stats);
    return stats;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PurchaseOrder> {
    console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/${id}`);
    
    const purchaseOrder = await this.purchaseOrdersService.findOne(id);
    
    console.log(`✅ [PurchaseOrdersController] Purchase order ${id} found:`, purchaseOrder.po_number);
    return purchaseOrder;
  }

  @Post()
  async create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    console.log('🔍 [PurchaseOrdersController] POST /admin/purchase-orders', createPurchaseOrderDto);
    
    const purchaseOrder = await this.purchaseOrdersService.create(createPurchaseOrderDto);
    
    console.log(`✅ [PurchaseOrdersController] Purchase order created with ID: ${purchaseOrder.id}`);
    return purchaseOrder;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    console.log(`🔍 [PurchaseOrdersController] PUT /admin/purchase-orders/${id}`, updatePurchaseOrderDto);
    
    const purchaseOrder = await this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
    
    console.log(`✅ [PurchaseOrdersController] Purchase order ${id} updated:`, purchaseOrder.po_number);
    return purchaseOrder;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🔍 [PurchaseOrdersController] DELETE /admin/purchase-orders/${id}`);
    
    await this.purchaseOrdersService.remove(id);
    
    console.log(`✅ [PurchaseOrdersController] Purchase order ${id} deleted successfully`);
    return { message: 'Purchase order deleted successfully' };
  }

  @Get(':id/items')
  async getPurchaseOrderItems(@Param('id', ParseIntPipe) id: number): Promise<PurchaseOrderItem[]> {
    console.log(`🔍 [PurchaseOrdersController] GET /admin/purchase-orders/${id}/items`);
    
    const items = await this.purchaseOrdersService.getPurchaseOrderItems(id);
    
    console.log(`✅ [PurchaseOrdersController] Found ${items.length} items for purchase order ${id}`);
    return items;
  }

  @Post('create-with-items')
  async createPurchaseOrderWithItems(@Body() createData: {
    po_number: string;
    invoice_number: string;
    supplier_id: number;
    order_date: string;
    expected_delivery_date?: string;
    notes?: string;
    created_by: number;
    items: {
      product_id: number;
      quantity: number;
      unit_price: number;
      tax_amount?: number;
      tax_type?: string;
    }[];
  }): Promise<PurchaseOrder> {
    console.log('🔍 [PurchaseOrdersController] POST /admin/purchase-orders/create-with-items', createData);
    
    const purchaseOrder = await this.purchaseOrdersService.createPurchaseOrderWithItems(createData);
    
    console.log(`✅ [PurchaseOrdersController] Purchase order created with items, ID: ${purchaseOrder.id}`);
    return purchaseOrder;
  }
}
