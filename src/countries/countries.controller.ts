import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('countries')
@UseGuards(JwtAuthGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    console.log('🌍 [CountriesController] Getting all countries');
    return this.countriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('🌍 [CountriesController] Getting country by ID:', id);
    return this.countriesService.findOne(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    console.log('🌍 [CountriesController] Getting country by name:', name);
    return this.countriesService.findByName(name);
  }
}
