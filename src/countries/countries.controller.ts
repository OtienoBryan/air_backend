import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
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
}
