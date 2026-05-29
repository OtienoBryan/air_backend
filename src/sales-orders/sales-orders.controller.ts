import { Controller, Get, Query, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { SalesOrdersService, SalesAnalytics, ClientSalesData, OrderItem, ProductPerformanceData, ProductPerformanceSummary } from './sales-orders.service';

@Controller('admin/sales')
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get('analytics')
  async getSalesAnalytics(@Query('year') year?: number): Promise<SalesAnalytics> {
    return this.salesOrdersService.getSalesAnalytics(year);
  }

  @Get('clients')
  async getAllClientSalesData(@Query('year') year?: number): Promise<ClientSalesData[]> {
    return this.salesOrdersService.getAllClientSalesData(year);
  }

  @Get('client/:clientId')
  async getClientSalesData(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query('year') year?: number
  ): Promise<ClientSalesData | null> {
    return this.salesOrdersService.getClientSalesData(clientId, year);
  }

  @Post('bulk-sales-data')
  async getBulkClientSalesData(
    @Body() body: { clientIds: number[], year?: number }
  ): Promise<ClientSalesData[]> {
    return this.salesOrdersService.getBulkClientSalesData(body.clientIds, body.year);
  }

  @Get('orders')
  async getSalesOrders(
    @Query('year') year?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.salesOrdersService.getSalesOrders(year, limit, offset);
  }

  @Get('clients-list')
  async getAllClients() {
    return this.salesOrdersService.getAllClients();
  }

  @Get('client/:id/sales')
  async getClientSalesDataById(
    @Param('id', ParseIntPipe) clientId: number,
    @Query('year') year?: number
  ): Promise<ClientSalesData | null> {
    return this.salesOrdersService.getClientSalesData(clientId, year);
  }

  @Get('client/:clientId/order-items')
  async getClientOrderItems(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query('year') year: number,
    @Query('month') month: number
  ): Promise<OrderItem[]> {
    console.log(`🔍 [Controller getClientOrderItems] Received request for clientId: ${clientId}, year: ${year}, month: ${month}`);
    
    try {
      const result = await this.salesOrdersService.getClientOrderItems(clientId, year, month);
      console.log(`✅ [Controller getClientOrderItems] Service returned ${result.length} items`);
      return result;
    } catch (error) {
      console.error(`❌ [Controller getClientOrderItems] Service error:`, error);
      throw error;
    }
  }

  @Get('products/performance')
  async getProductPerformance(@Query('year') year?: number): Promise<ProductPerformanceData[]> {
    console.log(`🔍 [Controller getProductPerformance] Request received for year: ${year}`);
    try {
      const result = await this.salesOrdersService.getProductPerformance(year);
      console.log(`✅ [Controller getProductPerformance] Returning ${result.length} products`);
      return result;
    } catch (error) {
      console.error(`❌ [Controller getProductPerformance] Service error:`, error);
      throw error;
    }
  }

  @Get('products/performance/summary')
  async getProductPerformanceSummary(@Query('year') year?: number): Promise<ProductPerformanceSummary> {
    console.log(`🔍 [Controller getProductPerformanceSummary] Request received for year: ${year}`);
    try {
      const result = await this.salesOrdersService.getProductPerformanceSummary(year);
      console.log(`✅ [Controller getProductPerformanceSummary] Returning summary data`);
      return result;
    } catch (error) {
      console.error(`❌ [Controller getProductPerformanceSummary] Service error:`, error);
      throw error;
    }
  }
}
