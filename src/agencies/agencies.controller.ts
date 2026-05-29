import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { Agency } from '../entities/agency.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('admin/agencies')
@UseGuards(JwtAuthGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ agencies: Agency[], total: number }> {
    console.log('🏢 [AgenciesController] GET /admin/agencies', { page, limit });
    return this.agenciesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Agency> {
    console.log(`🏢 [AgenciesController] GET /admin/agencies/${id}`);
    return this.agenciesService.findOne(id);
  }

  @Post()
  async create(@Body() createAgencyDto: CreateAgencyDto): Promise<Agency> {
    console.log('🏢 [AgenciesController] POST /admin/agencies');
    console.log('🏢 [AgenciesController] Create agency data:', JSON.stringify(createAgencyDto, null, 2));
    try {
      const result = await this.agenciesService.create(createAgencyDto);
      console.log('✅ [AgenciesController] Agency created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [AgenciesController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgencyDto: UpdateAgencyDto
  ): Promise<Agency> {
    console.log(`🏢 [AgenciesController] PUT /admin/agencies/${id}`);
    console.log('🏢 [AgenciesController] Update agency data:', updateAgencyDto);
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🏢 [AgenciesController] DELETE /admin/agencies/${id}`);
    await this.agenciesService.remove(id);
    return { message: 'Agency deleted successfully' };
  }

  @Get(':id/balance')
  async getBalance(@Param('id', ParseIntPipe) id: number): Promise<{ balance: number }> {
    console.log(`💰 [AgenciesController] GET /admin/agencies/${id}/balance`);
    const balance = await this.agenciesService.getAgencyBalance(id);
    return { balance };
  }

  @Get(':id/ledger')
  async getLedger(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    console.log(`📋 [AgenciesController] GET /admin/agencies/${id}/ledger`);
    return this.agenciesService.getAgencyLedger(id);
  }

  @Get('all/with-balance')
  async findAllWithBalance(): Promise<any[]> {
    console.log('🏢 [AgenciesController] GET /admin/agencies/all/with-balance');
    return this.agenciesService.findAllWithBalance();
  }

  @Post(':id/deposit')
  async createDeposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDepositDto: CreateDepositDto
  ): Promise<{ agency: Agency; account: any }> {
    console.log(`💰 [AgenciesController] POST /admin/agencies/${id}/deposit`);
    console.log('💰 [AgenciesController] Deposit data:', JSON.stringify(createDepositDto, null, 2));
    return this.agenciesService.createDeposit(id, createDepositDto);
  }

  @Get('deposits/all')
  async findAllDeposits(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ deposits: any[], total: number }> {
    console.log('💰 [AgenciesController] GET /admin/agencies/deposits/all', { page, limit });
    return this.agenciesService.findAllDeposits(page, limit);
  }
}

