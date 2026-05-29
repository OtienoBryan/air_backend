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
import { CrewService } from './crew.service';
import { Crew } from '../entities/crew.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Controller('admin/crew')
@UseGuards(JwtAuthGuard)
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ crew: Crew[], total: number }> {
    console.log('👨‍✈️ [CrewController] GET /admin/crew', { page, limit });
    return this.crewService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Crew> {
    console.log(`👨‍✈️ [CrewController] GET /admin/crew/${id}`);
    return this.crewService.findOne(id);
  }

  @Post()
  async create(@Body() createCrewDto: CreateCrewDto): Promise<Crew> {
    console.log('👨‍✈️ [CrewController] POST /admin/crew');
    console.log('👨‍✈️ [CrewController] Create crew data:', JSON.stringify(createCrewDto, null, 2));
    try {
      const result = await this.crewService.create(createCrewDto);
      console.log('✅ [CrewController] Crew member created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [CrewController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCrewDto: UpdateCrewDto
  ): Promise<Crew> {
    console.log(`👨‍✈️ [CrewController] PUT /admin/crew/${id}`);
    console.log('👨‍✈️ [CrewController] Update crew data:', updateCrewDto);
    return this.crewService.update(id, updateCrewDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`👨‍✈️ [CrewController] DELETE /admin/crew/${id}`);
    await this.crewService.remove(id);
    return { message: 'Crew member deleted successfully' };
  }
}

