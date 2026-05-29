"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartOfAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const account_type_entity_1 = require("../entities/account-type.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
let ChartOfAccountsService = class ChartOfAccountsService {
    chartOfAccountRepository;
    accountTypeRepository;
    journalEntryLineRepository;
    journalEntryRepository;
    constructor(chartOfAccountRepository, accountTypeRepository, journalEntryLineRepository, journalEntryRepository) {
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.accountTypeRepository = accountTypeRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.journalEntryRepository = journalEntryRepository;
    }
    async findAll(accountType) {
        console.log('📊 [ChartOfAccountsService] Finding all chart of accounts (frontend pagination)');
        console.log('📊 [ChartOfAccountsService] Filter by account_type:', accountType);
        try {
            const findOptions = {
                order: { code: 'ASC' },
            };
            if (accountType !== undefined) {
                findOptions.where = { account_type: accountType };
            }
            const [accounts, total] = await this.chartOfAccountRepository.findAndCount(findOptions);
            console.log(`📊 [ChartOfAccountsService] Returning all ${accounts.length} accounts (total: ${total})`);
            console.log(`📊 [ChartOfAccountsService] Frontend will handle pagination`);
            return { accounts, total };
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsService] Error in findAll:', error);
            throw error;
        }
    }
    async findOne(id) {
        console.log(`📊 [ChartOfAccountsService] Finding chart of account by ID: ${id}`);
        const account = await this.chartOfAccountRepository.findOne({
            where: { id },
            relations: ['accountType'],
        });
        if (!account) {
            console.log(`❌ [ChartOfAccountsService] Chart of account with ID ${id} not found`);
            throw new common_1.NotFoundException(`Chart of account with ID ${id} not found`);
        }
        console.log(`✅ [ChartOfAccountsService] Chart of account found: ${account.name}`);
        return account;
    }
    async create(createChartOfAccountDto) {
        console.log('📊 [ChartOfAccountsService] Creating new chart of account:', createChartOfAccountDto.name);
        const accountType = await this.accountTypeRepository.findOne({
            where: { id: createChartOfAccountDto.account_type },
        });
        if (!accountType) {
            console.log(`❌ [ChartOfAccountsService] Account type with ID ${createChartOfAccountDto.account_type} not found`);
            throw new common_1.NotFoundException(`Account type with ID ${createChartOfAccountDto.account_type} not found`);
        }
        const existingAccount = await this.chartOfAccountRepository.findOne({
            where: { code: createChartOfAccountDto.code },
        });
        if (existingAccount) {
            console.log(`❌ [ChartOfAccountsService] Account code ${createChartOfAccountDto.code} already exists`);
            throw new common_1.NotFoundException(`Account code ${createChartOfAccountDto.code} already exists`);
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
    async update(id, updateChartOfAccountDto) {
        console.log(`📊 [ChartOfAccountsService] Updating chart of account ID: ${id}`);
        const account = await this.findOne(id);
        if (updateChartOfAccountDto.account_type !== undefined) {
            const accountType = await this.accountTypeRepository.findOne({
                where: { id: updateChartOfAccountDto.account_type },
            });
            if (!accountType) {
                console.log(`❌ [ChartOfAccountsService] Account type with ID ${updateChartOfAccountDto.account_type} not found`);
                throw new common_1.NotFoundException(`Account type with ID ${updateChartOfAccountDto.account_type} not found`);
            }
        }
        if (updateChartOfAccountDto.code && updateChartOfAccountDto.code !== account.code) {
            const existingAccount = await this.chartOfAccountRepository.findOne({
                where: { code: updateChartOfAccountDto.code },
            });
            if (existingAccount) {
                console.log(`❌ [ChartOfAccountsService] Account code ${updateChartOfAccountDto.code} already exists`);
                throw new common_1.NotFoundException(`Account code ${updateChartOfAccountDto.code} already exists`);
            }
        }
        Object.assign(account, updateChartOfAccountDto);
        const updatedAccount = await this.chartOfAccountRepository.save(account);
        console.log(`✅ [ChartOfAccountsService] Chart of account updated: ${updatedAccount.name}`);
        return this.findOne(updatedAccount.id);
    }
    async remove(id) {
        console.log(`📊 [ChartOfAccountsService] Deleting chart of account ID: ${id}`);
        const account = await this.findOne(id);
        await this.chartOfAccountRepository.remove(account);
        console.log(`✅ [ChartOfAccountsService] Chart of account deleted: ${account.name}`);
    }
    async findAllAccountTypes() {
        console.log('📊 [ChartOfAccountsService] Finding all account types');
        try {
            const accountTypes = await this.accountTypeRepository.find({
                order: { name: 'ASC' },
            });
            console.log(`✅ [ChartOfAccountsService] Found ${accountTypes.length} account types`);
            return accountTypes;
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsService] Error finding account types:', error);
            throw error;
        }
    }
    async getTrialBalance(startDate, endDate, accountTypeId) {
        console.log('📊 [ChartOfAccountsService] Getting trial balance', { startDate, endDate, accountTypeId });
        try {
            const accountWhere = {};
            if (accountTypeId !== undefined) {
                accountWhere.account_type = accountTypeId;
            }
            const accounts = await this.chartOfAccountRepository.find({
                where: accountWhere,
                relations: ['accountType'],
                order: { code: 'ASC' },
            });
            const startDateFormatted = startDate.split('T')[0];
            const endDateFormatted = endDate.split('T')[0];
            const trialBalanceAccounts = await Promise.all(accounts.map(async (account) => {
                const openingBalanceResult = await this.journalEntryLineRepository
                    .createQueryBuilder('line')
                    .innerJoin('line.journal_entry', 'entry')
                    .where('line.account_id = :accountId', { accountId: account.id })
                    .andWhere('entry.status = :status', { status: 'posted' })
                    .andWhere('entry.entry_date < :startDate', { startDate: startDateFormatted })
                    .select('COALESCE(SUM(line.debit_amount), 0) - COALESCE(SUM(line.credit_amount), 0)', 'balance')
                    .getRawOne();
                const openingBalance = parseFloat(openingBalanceResult?.balance || '0');
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
            }));
            const activeAccounts = trialBalanceAccounts.filter((acc) => acc.opening_balance !== 0 || acc.debit !== 0 || acc.credit !== 0);
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
        }
        catch (error) {
            console.error('❌ [ChartOfAccountsService] Error calculating trial balance:', error);
            throw error;
        }
    }
};
exports.ChartOfAccountsService = ChartOfAccountsService;
exports.ChartOfAccountsService = ChartOfAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __param(1, (0, typeorm_1.InjectRepository)(account_type_entity_1.AccountType)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(3, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChartOfAccountsService);
//# sourceMappingURL=chart-of-accounts.service.js.map