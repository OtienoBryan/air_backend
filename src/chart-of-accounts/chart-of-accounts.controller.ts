import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { AccountType } from '../entities/account-type.entity';

@Controller('admin/chart-of-accounts')
@UseGuards(JwtAuthGuard)
export class ChartOfAccountsController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountsService) {}

  @Get()
  async findAll(
    @Query('account_type') accountType?: string,
  ): Promise<{ accounts: ChartOfAccount[], total: number }> {
    console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts');
    console.log('📊 [ChartOfAccountsController] Query params:', { accountType });
    
    const accountTypeNum = accountType ? parseInt(accountType, 10) : undefined;
    
    try {
      // Return all accounts - frontend handles pagination
      const result = await this.chartOfAccountsService.findAll(accountTypeNum);
      console.log('📊 [ChartOfAccountsController] Returning all accounts:', result.accounts.length);
      return result;
    } catch (error) {
      console.error('❌ [ChartOfAccountsController] Error:', error);
      throw error;
    }
  }

  @Get('account-types')
  async findAllAccountTypes(): Promise<AccountType[]> {
    console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/account-types');
    try {
      return await this.chartOfAccountsService.findAllAccountTypes();
    } catch (error) {
      console.error('❌ [ChartOfAccountsController] Error in findAllAccountTypes:', error);
      throw error;
    }
  }

  @Get('trial-balance')
  async getTrialBalance(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
    @Query('account_type') accountType?: string,
  ) {
    console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/trial-balance');
    console.log('📊 [ChartOfAccountsController] Query params:', { startDate, endDate, accountType });
    
    if (!startDate || !endDate) {
      throw new Error('start_date and end_date are required');
    }

    const accountTypeNum = accountType ? parseInt(accountType, 10) : undefined;
    
    try {
      return await this.chartOfAccountsService.getTrialBalance(startDate, endDate, accountTypeNum);
    } catch (error) {
      console.error('❌ [ChartOfAccountsController] Error in getTrialBalance:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ChartOfAccount> {
    console.log(`📊 [ChartOfAccountsController] GET /admin/chart-of-accounts/${id}`);
    return this.chartOfAccountsService.findOne(id);
  }

  @Post()
  async create(@Body() createChartOfAccountDto: CreateChartOfAccountDto): Promise<ChartOfAccount> {
    console.log('📊 [ChartOfAccountsController] POST /admin/chart-of-accounts');
    console.log('📊 [ChartOfAccountsController] Create data:', JSON.stringify(createChartOfAccountDto, null, 2));
    return this.chartOfAccountsService.create(createChartOfAccountDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChartOfAccountDto: UpdateChartOfAccountDto,
  ): Promise<ChartOfAccount> {
    console.log(`📊 [ChartOfAccountsController] PATCH /admin/chart-of-accounts/${id}`);
    return this.chartOfAccountsService.update(id, updateChartOfAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`📊 [ChartOfAccountsController] DELETE /admin/chart-of-accounts/${id}`);
    await this.chartOfAccountsService.remove(id);
    return { message: 'Chart of account deleted successfully' };
  }
}
