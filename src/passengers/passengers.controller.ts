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
import { PassengersService } from './passengers.service';
import { Passenger } from '../entities/passenger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('admin/passengers')
@UseGuards(JwtAuthGuard)
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get()
  async findAll(
    @Query('page')   page:   number = 1,
    @Query('limit')  limit:  number = 50,
    @Query('search') search?: string,
  ): Promise<{ passengers: Passenger[], total: number }> {
    return this.passengersService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Passenger> {
    console.log(`👤 [PassengersController] GET /admin/passengers/${id}`);
    return this.passengersService.findOne(id);
  }

  @Post()
  async create(@Body() createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    console.log('👤 [PassengersController] POST /admin/passengers');
    console.log('👤 [PassengersController] Create passenger data:', JSON.stringify(createPassengerDto, null, 2));
    try {
      const result = await this.passengersService.create(createPassengerDto);
      console.log('✅ [PassengersController] Passenger created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [PassengersController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePassengerDto: UpdatePassengerDto
  ): Promise<Passenger> {
    console.log(`👤 [PassengersController] PUT /admin/passengers/${id}`);
    console.log('👤 [PassengersController] Update passenger data:', updatePassengerDto);
    return this.passengersService.update(id, updatePassengerDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`👤 [PassengersController] DELETE /admin/passengers/${id}`);
    await this.passengersService.remove(id);
    return { message: 'Passenger deleted successfully' };
  }
}

