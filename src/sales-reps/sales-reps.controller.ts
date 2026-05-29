import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SalesRepsService } from './sales-reps.service';
import { SalesRep } from '../entities/sales-rep.entity';
import { Region } from '../entities/region.entity';
import { Route } from '../entities/route.entity';

@Controller('sales-reps')
export class SalesRepsController {
  constructor(private readonly salesRepsService: SalesRepsService) {}

  @Get()
  async findAll(): Promise<SalesRep[]> {
    return this.salesRepsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.salesRepsService.getSalesRepStats();
  }

  @Get('countries')
  async getCountries() {
    return this.salesRepsService.getCountries();
  }

  @Get('regions')
  async getRegions(@Query('countryId') countryId?: string) {
    const countryIdNum = countryId ? parseInt(countryId) : undefined;
    return this.salesRepsService.getRegions(countryIdNum);
  }

  @Get('routes')
  async getRoutes(@Query('regionId') regionId?: string) {
    const regionIdNum = regionId ? parseInt(regionId) : undefined;
    return this.salesRepsService.getRoutes(regionIdNum);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SalesRep> {
    const salesRep = await this.salesRepsService.findOne(id);
    if (!salesRep) {
      throw new Error('Sales representative not found');
    }
    return salesRep;
  }

  @Post()
  async create(@Body() salesRepData: Partial<SalesRep>): Promise<SalesRep> {
    return this.salesRepsService.create(salesRepData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() salesRepData: Partial<SalesRep>
  ): Promise<SalesRep> {
    return this.salesRepsService.update(id, salesRepData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.salesRepsService.remove(id);
    return { message: 'Sales representative deleted successfully' };
  }
}
