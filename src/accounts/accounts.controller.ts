import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('admin/accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ accounts: Account[], total: number }> {
    console.log('💰 [AccountsController] GET /admin/accounts', { page, limit });
    return this.accountsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    console.log(`💰 [AccountsController] GET /admin/accounts/${id}`);
    return this.accountsService.findOne(id);
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    console.log('💰 [AccountsController] POST /admin/accounts');
    console.log('💰 [AccountsController] Create account data:', JSON.stringify(createAccountDto, null, 2));
    try {
      const result = await this.accountsService.create(createAccountDto);
      console.log('✅ [AccountsController] Account created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [AccountsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto
  ): Promise<Account> {
    console.log(`💰 [AccountsController] PUT /admin/accounts/${id}`);
    console.log('💰 [AccountsController] Update account data:', updateAccountDto);
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`💰 [AccountsController] DELETE /admin/accounts/${id}`);
    await this.accountsService.remove(id);
    return { message: 'Account deleted successfully' };
  }

  @Get(':id/balance')
  async getBalance(@Param('id', ParseIntPipe) id: number): Promise<{ balance: number }> {
    console.log(`💰 [AccountsController] GET /admin/accounts/${id}/balance`);
    const balance = await this.accountsService.getAccountBalance(id);
    return { balance };
  }

  @Get(':id/ledger')
  async getLedger(@Param('id', ParseIntPipe) id: number): Promise<AccountLedger[]> {
    console.log(`📋 [AccountsController] GET /admin/accounts/${id}/ledger`);
    return this.accountsService.getAccountLedger(id);
  }
}

