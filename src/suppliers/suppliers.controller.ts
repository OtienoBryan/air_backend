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
import { SuppliersService, SupplierStats, PayablesAgingSummary } from './suppliers.service';
import type { CreateSupplierDto, UpdateSupplierDto } from './suppliers.service';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<{ suppliers: (Supplier & { current_balance: number })[], total: number }> {
    console.log('🔍 [SuppliersController] GET /admin/suppliers', { page, limit, search, status });
    
    const result = await this.suppliersService.findAll(page, limit, search, status);
    
    console.log(`✅ [SuppliersController] Returning ${result.suppliers.length} suppliers out of ${result.total} total`);
    return result;
  }

  @Get('stats')
  async getStats(): Promise<SupplierStats> {
    console.log('🔍 [SuppliersController] GET /admin/suppliers/stats');
    
    const stats = await this.suppliersService.getStats();
    
    console.log('✅ [SuppliersController] Stats calculated:', stats);
    return stats;
  }

  @Get('search')
  async searchSuppliers(@Query('q') searchTerm: string): Promise<Supplier[]> {
    console.log('🔍 [SuppliersController] GET /admin/suppliers/search', { searchTerm });
    
    const suppliers = await this.suppliersService.searchSuppliers(searchTerm);
    
    console.log(`✅ [SuppliersController] Found ${suppliers.length} suppliers for search: ${searchTerm}`);
    return suppliers;
  }

  @Get(':id/ledger')
  async getLedger(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.getLedger(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Supplier> {
    console.log(`🔍 [SuppliersController] GET /admin/suppliers/${id}`);
    
    const supplier = await this.suppliersService.findOne(id);
    
    console.log(`✅ [SuppliersController] Supplier ${id} found:`, supplier.company_name);
    return supplier;
  }

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    console.log('🔍 [SuppliersController] POST /admin/suppliers', createSupplierDto);
    
    const supplier = await this.suppliersService.create(createSupplierDto);
    
    console.log(`✅ [SuppliersController] Supplier created with ID: ${supplier.id}`);
    return supplier;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto
  ): Promise<Supplier> {
    console.log(`🔍 [SuppliersController] PUT /admin/suppliers/${id}`, updateSupplierDto);
    
    const supplier = await this.suppliersService.update(id, updateSupplierDto);
    
    console.log(`✅ [SuppliersController] Supplier ${id} updated:`, supplier.company_name);
    return supplier;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🔍 [SuppliersController] DELETE /admin/suppliers/${id}`);
    
    await this.suppliersService.remove(id);
    
    console.log(`✅ [SuppliersController] Supplier ${id} deleted successfully`);
    return { message: 'Supplier deleted successfully' };
  }

  @Get('payables/aging')
  async getPayablesAging(): Promise<PayablesAgingSummary> {
    console.log('🔍 [SuppliersController] GET /admin/suppliers/payables/aging');
    
    const result = await this.suppliersService.getPayablesAging();
    
    console.log(`✅ [SuppliersController] Payables aging analysis: ${result.items.length} suppliers`);
    return result;
  }

  @Get('payables/:supplierId/invoices/:agingPeriod')
  async getSupplierInvoicesByAging(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('agingPeriod') agingPeriod: 'current' | 'days31_60' | 'days61_90' | 'days91_120' | 'days120_plus',
  ): Promise<SupplierLedger[]> {
    console.log(`🔍 [SuppliersController] GET /admin/suppliers/payables/${supplierId}/invoices/${agingPeriod}`);
    
    const result = await this.suppliersService.getSupplierInvoicesByAging(supplierId, agingPeriod);
    
    console.log(`✅ [SuppliersController] Found ${result.length} invoices for supplier ${supplierId}`);
    return result;
  }
}
