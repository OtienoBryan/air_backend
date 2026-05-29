import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JournalEntry } from '../entities/journal-entry.entity';
import { ExpensesService } from './expenses.service';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('admin/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
  ) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ expenses: Expense[], total: number }> {
    console.log('💰 [ExpensesController] GET /admin/expenses', { page, limit });
    return this.expensesService.findAll(page, limit);
  }

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto, @Request() req): Promise<Expense> {
    console.log('💰 [ExpensesController] POST /admin/expenses');
    console.log('💰 [ExpensesController] Create expense data:', JSON.stringify(createExpenseDto, null, 2));
    console.log('💰 [ExpensesController] User ID:', req.user?.sub);
    try {
      const createdBy = req.user?.sub ? Number(req.user.sub) : null;
      const result = await this.expensesService.create(createExpenseDto, createdBy);
      console.log('✅ [ExpensesController] Expense created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [ExpensesController] Error in create:', error);
      throw error;
    }
  }

  @Patch(':id/payment')
  async updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    console.log(`💰 [ExpensesController] PATCH /admin/expenses/${id}/payment`);
    console.log('💰 [ExpensesController] Update payment data:', JSON.stringify(updateExpenseDto, null, 2));
    try {
      const result = await this.expensesService.updatePayment(id, updateExpenseDto);
      console.log(`✅ [ExpensesController] Payment updated successfully for expense ${id}`);
      return result;
    } catch (error) {
      console.error('❌ [ExpensesController] Error in updatePayment:', error);
      throw error;
    }
  }

  @Get(':id/payment-history')
  async getPaymentHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<JournalEntry[]> {
    console.log(`💰 [ExpensesController] GET /admin/expenses/${id}/payment-history`);
    try {
      const result = await this.expensesService.getPaymentHistory(id);
      console.log(`✅ [ExpensesController] Payment history retrieved for expense ${id}: ${result.length} entries`);
      return result;
    } catch (error) {
      console.error('❌ [ExpensesController] Error in getPaymentHistory:', error);
      throw error;
    }
  }
}

@Controller('admin/chart-of-accounts')
@UseGuards(JwtAuthGuard)
export class ChartOfAccountsController {
  constructor(
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
  ) {}

  @Get()
  async findByType(@Query('account_type') accountType?: number): Promise<ChartOfAccount[]> {
    console.log('📊 [ChartOfAccountsController] GET /admin/chart-of-accounts', { accountType });
    
    if (accountType !== undefined) {
      const accounts = await this.chartOfAccountRepository.find({
        where: { account_type: accountType },
        order: { name: 'ASC' },
      });
      console.log(`✅ [ChartOfAccountsController] Found ${accounts.length} accounts with type ${accountType}`);
      return accounts;
    }
    
    const allAccounts = await this.chartOfAccountRepository.find({
      order: { name: 'ASC' },
    });
    console.log(`✅ [ChartOfAccountsController] Found ${allAccounts.length} accounts`);
    return allAccounts;
  }
}
