import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(AccountLedger)
    private accountLedgerRepository: Repository<AccountLedger>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ accounts: Account[], total: number }> {
    console.log('💰 [AccountsService] Finding all payment accounts from chart_of_accounts (account_type = 9)');
    
    // Fetch payment accounts from chart_of_accounts where account_type = 9
    const [chartAccounts, total] = await this.chartOfAccountRepository.findAndCount({
      where: { account_type: 9 },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // Map ChartOfAccount to Account format for compatibility
    const accounts: Account[] = chartAccounts.map(ca => ({
      id: ca.id,
      name: ca.name,
      code: ca.code,
      currency: null,
      balance: 0,
      status: 'active',
      created_at: ca.created_at,
      updated_at: ca.updated_at,
    } as Account));
    
    console.log(`✅ [AccountsService] Found ${accounts.length} payment accounts`);
    return { accounts, total };
  }

  async findOne(id: number): Promise<Account> {
    console.log(`💰 [AccountsService] Finding payment account by ID: ${id} from chart_of_accounts`);
    
    // Fetch from chart_of_accounts where account_type = 9
    const chartAccount = await this.chartOfAccountRepository.findOne({
      where: { id, account_type: 9 },
    });
    
    if (!chartAccount) {
      console.log(`❌ [AccountsService] Payment account with ID ${id} not found`);
      throw new NotFoundException(`Payment account with ID ${id} not found`);
    }
    
    // Map ChartOfAccount to Account format
    const account: Account = {
      id: chartAccount.id,
      name: chartAccount.name,
      code: chartAccount.code,
      currency: null,
      balance: 0,
      status: 'active',
      created_at: chartAccount.created_at,
      updated_at: chartAccount.updated_at,
    } as Account;
    
    console.log(`✅ [AccountsService] Payment account found: ${account.name}`);
    return account;
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    console.log('💰 [AccountsService] Creating new account:', createAccountDto.name);
    
    const account = this.accountRepository.create({
      name: createAccountDto.name,
      code: createAccountDto.code,
      currency: createAccountDto.currency ?? null,
      balance: createAccountDto.balance ?? 0,
      status: createAccountDto.status ?? 'active',
    });
    
    const savedAccount = await this.accountRepository.save(account);
    
    // Create initial ledger entry if balance is not zero (non-blocking)
    if (savedAccount.balance !== 0) {
      try {
        await this.accountLedgerRepository.save({
          account_id: savedAccount.id,
          transactionDate: new Date(),
          description: 'Initial balance',
          debit: savedAccount.balance > 0 ? savedAccount.balance : 0,
          credit: savedAccount.balance < 0 ? Math.abs(savedAccount.balance) : 0,
          balance: savedAccount.balance,
          reference: 'INITIAL',
          payment_method: null,
        });
      } catch (e) {
        console.warn('⚠️ [AccountsService] Skipping initial ledger entry (table may not exist):', (e as Error).message);
      }
    }
    
    console.log(`✅ [AccountsService] Account created with ID: ${savedAccount.id}`);
    return this.findOne(savedAccount.id);
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    console.log(`💰 [AccountsService] Updating account ID: ${id}`);
    
    const account = await this.findOne(id);
    
    if (updateAccountDto.name !== undefined) account.name = updateAccountDto.name;
    if (updateAccountDto.code !== undefined) account.code = updateAccountDto.code;
    if (updateAccountDto.currency !== undefined) account.currency = updateAccountDto.currency ?? null;
    if (updateAccountDto.balance !== undefined) account.balance = updateAccountDto.balance;
    if (updateAccountDto.status !== undefined) account.status = updateAccountDto.status;
    
    const updatedAccount = await this.accountRepository.save(account);
    console.log(`✅ [AccountsService] Account updated: ${updatedAccount.name}`);
    return this.findOne(updatedAccount.id);
  }

  async remove(id: number): Promise<void> {
    console.log(`💰 [AccountsService] Deleting account ID: ${id}`);
    
    const account = await this.findOne(id);
    await this.accountRepository.remove(account);
    
    console.log(`✅ [AccountsService] Account deleted: ${account.name}`);
  }

  async getAccountBalance(accountId: number): Promise<number> {
    try {
      const latestLedger = await this.accountLedgerRepository.findOne({
        where: { account_id: accountId },
        order: { transactionDate: 'DESC', createdAt: 'DESC' },
      });
      return latestLedger ? Number(latestLedger.balance) : 0;
    } catch {
      return 0;
    }
  }

  async getAccountLedger(accountId: number): Promise<AccountLedger[]> {
    try {
      return await this.accountLedgerRepository.find({
        where: { account_id: accountId },
        order: { transactionDate: 'DESC', createdAt: 'DESC' },
      });
    } catch {
      return [];
    }
  }
}

