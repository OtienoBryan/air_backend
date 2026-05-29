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
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';

@Controller('admin/luggage')
@UseGuards(JwtAuthGuard)
export class LuggageController {
  constructor(private readonly luggageService: LuggageService) {}

  @Post()
  async create(@Body() createLuggageDto: CreateLuggageDto): Promise<Luggage> {
    console.log('🧳 [LuggageController] POST /admin/luggage');
    return this.luggageService.create(createLuggageDto);
  }

  @Get('all')
  async findAllWithDetails(
    @Query('flightSeriesId') flightSeriesId?: string,
  ): Promise<any[]> {
    const flightId = flightSeriesId ? parseInt(flightSeriesId, 10) : undefined;
    if (flightSeriesId && isNaN(flightId!)) {
      throw new Error('flightSeriesId must be a valid number');
    }
    console.log(`🧳 [LuggageController] GET /admin/luggage/all${flightId ? `?flightSeriesId=${flightId}` : ''}`);
    return this.luggageService.findAllWithDetails(flightId);
  }

  @Get('passenger/:passengerId')
  async findAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<Luggage[]> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/passenger/${passengerId}`);
    return this.luggageService.findAllByPassenger(passengerId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Luggage> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/${id}`);
    return this.luggageService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLuggageDto: UpdateLuggageDto,
  ): Promise<Luggage> {
    console.log(`🧳 [LuggageController] PUT /admin/luggage/${id}`);
    return this.luggageService.update(id, updateLuggageDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/${id}`);
    await this.luggageService.remove(id);
    return { message: 'Luggage deleted successfully' };
  }

  @Delete('passenger/:passengerId')
  async removeAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/passenger/${passengerId}`);
    await this.luggageService.removeAllByPassenger(passengerId);
    return { message: 'All luggage deleted successfully' };
  }
}

