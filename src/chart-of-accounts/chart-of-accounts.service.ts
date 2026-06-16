import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { AccountType } from '../entities/account-type.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(AccountType)
    private accountTypeRepository: Repository<AccountType>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
  ) {}

  async findAll(accountType?: number): Promise<{ accounts: ChartOfAccount[], total: number }> {
    console.log('📊 [ChartOfAccountsService] Finding all chart of accounts (frontend pagination)');
    console.log('📊 [ChartOfAccountsService] Filter by account_type:', accountType);
    
    try {
      // Return ALL accounts - frontend will handle pagination
      const findOptions: any = {
        order: { code: 'ASC' },
      };

      if (accountType !== undefined) {
        findOptions.where = { account_type: accountType };
      }

      const [accounts, total] = await this.chartOfAccountRepository.findAndCount(findOptions);
      
      console.log(`📊 [ChartOfAccountsService] Returning all ${accounts.length} accounts (total: ${total})`);
      console.log(`📊 [ChartOfAccountsService] Frontend will handle pagination`);
      
      return { accounts, total };
    } catch (error) {
      console.error('❌ [ChartOfAccountsService] Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ChartOfAccount> {
    console.log(`📊 [ChartOfAccountsService] Finding chart of account by ID: ${id}`);
    
    const account = await this.chartOfAccountRepository.findOne({
      where: { id },
      relations: ['accountType'],
    });
    
    if (!account) {
      console.log(`❌ [ChartOfAccountsService] Chart of account with ID ${id} not found`);
      throw new NotFoundException(`Chart of account with ID ${id} not found`);
    }
    
    console.log(`✅ [ChartOfAccountsService] Chart of account found: ${account.name}`);
    return account;
  }

  async create(createChartOfAccountDto: CreateChartOfAccountDto): Promise<ChartOfAccount> {
    console.log('📊 [ChartOfAccountsService] Creating new chart of account:', createChartOfAccountDto.name);
    
    // Verify account type exists
    const accountType = await this.accountTypeRepository.findOne({
      where: { id: createChartOfAccountDto.account_type },
    });
    
    if (!accountType) {
      console.log(`❌ [ChartOfAccountsService] Account type with ID ${createChartOfAccountDto.account_type} not found`);
      throw new NotFoundException(`Account type with ID ${createChartOfAccountDto.account_type} not found`);
    }

    // Check if account code already exists
    const existingAccount = await this.chartOfAccountRepository.findOne({
      where: { code: createChartOfAccountDto.code },
    });
    
    if (existingAccount) {
      console.log(`❌ [ChartOfAccountsService] Account code ${createChartOfAccountDto.code} already exists`);
      throw new NotFoundException(`Account code ${createChartOfAccountDto.code} already exists`);
    }
    
    const account = this.chartOfAccountRepository.create({
      name: createChartOfAccountDto.name,
      code: createChartOfAccountDto.code,
      account_type: createChartOfAccountDto.account_type,
    });
    
    const savedAccount = await this.chartOfAccountRepository.save(account);
    
    console.log(`✅ [ChartOfAccountsService] Chart of account created with ID: ${savedAccount.id}`);
    return this.findOne(savedAccount.id);
  }

  async update(id: number, updateChartOfAccountDto: UpdateChartOfAccountDto): Promise<ChartOfAccount> {
    console.log(`📊 [ChartOfAccountsService] Updating chart of account ID: ${id}`);

    const account = await this.findOne(id);

    if (updateChartOfAccountDto.account_type !== undefined) {
      const accountType = await this.accountTypeRepository.findOne({
        where: { id: updateChartOfAccountDto.account_type },
      });
      if (!accountType) {
        throw new NotFoundException(`Account type with ID ${updateChartOfAccountDto.account_type} not found`);
      }
    }

    if (updateChartOfAccountDto.code && updateChartOfAccountDto.code !== account.code) {
      const existing = await this.chartOfAccountRepository.findOne({
        where: { code: updateChartOfAccountDto.code },
      });
      if (existing) {
        throw new NotFoundException(`Account code ${updateChartOfAccountDto.code} already exists`);
      }
    }

    const patch: Partial<ChartOfAccount> = {};
    if (updateChartOfAccountDto.name        !== undefined) patch.name         = updateChartOfAccountDto.name;
    if (updateChartOfAccountDto.code        !== undefined) patch.code         = updateChartOfAccountDto.code;
    if (updateChartOfAccountDto.account_type !== undefined) patch.account_type = updateChartOfAccountDto.account_type;

    await this.chartOfAccountRepository.update(id, patch);

    console.log(`✅ [ChartOfAccountsService] Chart of account ${id} updated`);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    console.log(`📊 [ChartOfAccountsService] Deleting chart of account ID: ${id}`);
    
    const account = await this.findOne(id);
    await this.chartOfAccountRepository.remove(account);
    
    console.log(`✅ [ChartOfAccountsService] Chart of account deleted: ${account.name}`);
  }

  async findAllAccountTypes(): Promise<AccountType[]> {
    console.log('📊 [ChartOfAccountsService] Finding all account types');
    
    try {
      const accountTypes = await this.accountTypeRepository.find({
        order: { name: 'ASC' },
      });
      
      console.log(`✅ [ChartOfAccountsService] Found ${accountTypes.length} account types`);
      return accountTypes;
    } catch (error) {
      console.error('❌ [ChartOfAccountsService] Error finding account types:', error);
      throw error;
    }
  }

  async getTrialBalance(
    startDate: string,
    endDate: string,
    accountTypeId?: number,
  ): Promise<{
    accounts: Array<{
      account_id: number;
      account_code: string;
      account_name: string;
      category: string;
      opening_balance: number;
      debit: number;
      credit: number;
      period_balance: number;
      closing_balance: number;
    }>;
    totals: {
      total_debit: number;
      total_credit: number;
      total_period_balance: number;
      total_opening_balance: number;
      total_closing_balance: number;
    };
  }> {
    console.log('📊 [ChartOfAccountsService] Getting trial balance', { startDate, endDate, accountTypeId });
    
    try {
      // Get all accounts (filtered by account type if provided)
      const accountWhere: any = {};
      if (accountTypeId !== undefined) {
        accountWhere.account_type = accountTypeId;
      }
      
      const accounts = await this.chartOfAccountRepository.find({
        where: accountWhere,
        relations: ['accountType'],
        order: { code: 'ASC' },
      });

      // Format dates for MySQL (YYYY-MM-DD)
      const startDateFormatted = startDate.split('T')[0];
      const endDateFormatted = endDate.split('T')[0];

      const trialBalanceAccounts = await Promise.all(
        accounts.map(async (account) => {
          // Calculate opening balance (all transactions before start date)
          const openingBalanceResult = await this.journalEntryLineRepository
            .createQueryBuilder('line')
            .innerJoin('line.journal_entry', 'entry')
            .where('line.account_id = :accountId', { accountId: account.id })
            .andWhere('entry.status = :status', { status: 'posted' })
            .andWhere('entry.entry_date < :startDate', { startDate: startDateFormatted })
            .select('COALESCE(SUM(line.debit_amount), 0) - COALESCE(SUM(line.credit_amount), 0)', 'balance')
            .getRawOne();

          const openingBalance = parseFloat(openingBalanceResult?.balance || '0');

          // Calculate period debit and credit (transactions within date range)
          const periodResult = await this.journalEntryLineRepository
            .createQueryBuilder('line')
            .innerJoin('line.journal_entry', 'entry')
            .where('line.account_id = :accountId', { accountId: account.id })
            .andWhere('entry.status = :status', { status: 'posted' })
            .andWhere('entry.entry_date >= :startDate', { startDate: startDateFormatted })
            .andWhere('entry.entry_date <= :endDate', { endDate: endDateFormatted })
            .select([
              'COALESCE(SUM(line.debit_amount), 0) as debit',
              'COALESCE(SUM(line.credit_amount), 0) as credit',
            ])
            .getRawOne();

          const debit = parseFloat(periodResult?.debit || '0');
          const credit = parseFloat(periodResult?.credit || '0');
          const periodBalance = debit - credit;
          const closingBalance = openingBalance + periodBalance;

          return {
            account_id: account.id,
            account_code: account.code,
            account_name: account.name,
            category: account.accountType?.name || 'Unknown',
            opening_balance: openingBalance,
            debit,
            credit,
            period_balance: periodBalance,
            closing_balance: closingBalance,
          };
        })
      );

      // Filter out accounts with no activity (optional - you might want to show all accounts)
      const activeAccounts = trialBalanceAccounts.filter(
        (acc) => acc.opening_balance !== 0 || acc.debit !== 0 || acc.credit !== 0
      );

      // Calculate totals
      const totals = {
        total_debit: activeAccounts.reduce((sum, acc) => sum + acc.debit, 0),
        total_credit: activeAccounts.reduce((sum, acc) => sum + acc.credit, 0),
        total_period_balance: activeAccounts.reduce((sum, acc) => sum + acc.period_balance, 0),
        total_opening_balance: activeAccounts.reduce((sum, acc) => sum + acc.opening_balance, 0),
        total_closing_balance: activeAccounts.reduce((sum, acc) => sum + acc.closing_balance, 0),
      };

      console.log(`✅ [ChartOfAccountsService] Trial balance calculated for ${activeAccounts.length} accounts`);
      
      return {
        accounts: activeAccounts,
        totals,
      };
    } catch (error) {
      console.error('❌ [ChartOfAccountsService] Error calculating trial balance:', error);
      throw error;
    }
  }
}
