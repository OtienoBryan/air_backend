import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('countries')
@UseGuards(JwtAuthGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.findOne(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return this.countriesService.findByName(name);
  }
}

@Controller('admin/countries')
@UseGuards(JwtAuthGuard)
export class AdminCountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    return this.countriesService.findAllAdmin();
  }

  @Post()
  async create(@Body() body: { name: string; status: number; tax_percentage?: number | null }) {
    return this.countriesService.create(body);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; status?: number; tax_percentage?: number | null }) {
    return this.countriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.countriesService.remove(id);
    return { message: 'Country deleted successfully' };
  }

  // ── Tax accounts lookup ────────────────────────────────────────────────────
  @Get('tax-accounts')
  async getTaxAccounts() {
    return this.countriesService.getTaxAccounts();
  }

  // ── Country Taxes ──────────────────────────────────────────────────────────
  @Get(':id/taxes')
  async getTaxes(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.getTaxes(id);
  }

  @Post(':id/taxes')
  async addTax(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { account_id: number; amount: number; currency: string },
  ) {
    return this.countriesService.addTax(id, body);
  }

  @Put(':id/taxes/:taxId')
  async updateTax(
    @Param('id', ParseIntPipe) id: number,
    @Param('taxId', ParseIntPipe) taxId: number,
    @Body() body: { account_id?: number; amount?: number; currency?: string },
  ) {
    return this.countriesService.updateTax(id, taxId, body);
  }

  @Delete(':id/taxes/:taxId')
  @HttpCode(HttpStatus.OK)
  async removeTax(
    @Param('id', ParseIntPipe) id: number,
    @Param('taxId', ParseIntPipe) taxId: number,
  ) {
    await this.countriesService.removeTax(id, taxId);
    return { message: 'Tax removed successfully' };
  }
}
