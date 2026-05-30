import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FlightRoutesService } from './flight-routes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/flight-routes')
@UseGuards(JwtAuthGuard)
export class FlightRoutesController {
  constructor(private readonly flightRoutesService: FlightRoutesService) {}

  @Get()
  findAll() {
    return this.flightRoutesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.findOne(id);
  }

  @Post()
  create(@Body() body: {
    from_destination_id: number;
    to_destination_id: number;
    adult_fare?: number | null;
    child_fare?: number | null;
    infant_fare?: number | null;
    status?: string;
  }) {
    return this.flightRoutesService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      from_destination_id?: number;
      to_destination_id?: number;
      adult_fare?: number | null;
      child_fare?: number | null;
      infant_fare?: number | null;
      status?: string;
    },
  ) {
    return this.flightRoutesService.update(id, body);
  }

  @Get(':id/fare-history')
  getFareHistory(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.getFareHistory(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightRoutesService.remove(id);
  }
}
