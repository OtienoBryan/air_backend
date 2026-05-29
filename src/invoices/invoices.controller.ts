import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { InvoicesService, InvoiceData, InvoiceSummary } from './invoices.service';

@Controller('admin/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getInvoices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('myStatus') myStatus?: string,
  ): Promise<{ invoices: InvoiceData[], total: number }> {
    console.log('🔍 [InvoicesController] GET /admin/invoices', { page, limit, search, status, myStatus });
    
    const result = await this.invoicesService.getInvoices(page, limit, search, status, myStatus);
    
    console.log(`✅ [InvoicesController] Returning ${result.invoices.length} invoices out of ${result.total} total`);
    return result;
  }

  @Get('summary')
  async getInvoiceSummary(): Promise<InvoiceSummary> {
    console.log('🔍 [InvoicesController] GET /admin/invoices/summary');
    
    const summary = await this.invoicesService.getInvoiceSummary();
    
    console.log('✅ [InvoicesController] Summary calculated:', summary);
    return summary;
  }

  @Get(':id')
  async getInvoiceById(@Param('id', ParseIntPipe) id: number): Promise<InvoiceData | null> {
    console.log(`🔍 [InvoicesController] GET /admin/invoices/${id}`);
    
    const invoice = await this.invoicesService.getInvoiceById(id);
    
    if (invoice) {
      console.log(`✅ [InvoicesController] Invoice ${id} found:`, invoice.soNumber);
    } else {
      console.log(`⚠️ [InvoicesController] Invoice ${id} not found`);
    }
    
    return invoice;
  }

  @Get(':id/order-items')
  async getInvoiceOrderItems(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    console.log(`🔍 [InvoicesController] GET /admin/invoices/${id}/order-items`);
    
    const orderItems = await this.invoicesService.getInvoiceOrderItems(id);
    
    console.log(`✅ [InvoicesController] Found ${orderItems.length} order items for invoice ${id}`);
    return orderItems;
  }
}
