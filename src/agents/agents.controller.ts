import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { Agent } from '../entities/agent.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('admin/agents')
@UseGuards(JwtAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ agents: Agent[], total: number }> {
    console.log('👤 [AgentsController] GET /admin/agents', { page, limit });
    return this.agentsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Agent> {
    console.log(`👤 [AgentsController] GET /admin/agents/${id}`);
    return this.agentsService.findOne(id);
  }

  @Post()
  async create(@Body() createAgentDto: CreateAgentDto): Promise<Agent> {
    console.log('👤 [AgentsController] POST /admin/agents');
    console.log('👤 [AgentsController] Create agent data:', JSON.stringify(createAgentDto, null, 2));
    try {
      const result = await this.agentsService.create(createAgentDto);
      console.log('✅ [AgentsController] Agent created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [AgentsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentDto: UpdateAgentDto
  ): Promise<Agent> {
    console.log(`👤 [AgentsController] PUT /admin/agents/${id}`);
    console.log('👤 [AgentsController] Update agent data:', updateAgentDto);
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`👤 [AgentsController] DELETE /admin/agents/${id}`);
    await this.agentsService.remove(id);
    return { message: 'Agent deleted successfully' };
  }
}

