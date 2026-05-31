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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_entity_1 = require("../entities/account.entity");
const account_ledger_entity_1 = require("../entities/account-ledger.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
let AccountsService = class AccountsService {
    accountRepository;
    accountLedgerRepository;
    chartOfAccountRepository;
    constructor(accountRepository, accountLedgerRepository, chartOfAccountRepository) {
        this.accountRepository = accountRepository;
        this.accountLedgerRepository = accountLedgerRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
    }
    async findAll(page = 1, limit = 50) {
        console.log('💰 [AccountsService] Finding all payment accounts from chart_of_accounts (account_type = 9)');
        const [chartAccounts, total] = await this.chartOfAccountRepository.findAndCount({
            where: { account_type: 9 },
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const accounts = chartAccounts.map(ca => ({
            id: ca.id,
            name: ca.name,
            code: ca.code,
            currency: null,
            balance: 0,
            status: 'active',
            created_at: ca.created_at,
            updated_at: ca.updated_at,
        }));
        console.log(`✅ [AccountsService] Found ${accounts.length} payment accounts`);
        return { accounts, total };
    }
    async findOne(id) {
        console.log(`💰 [AccountsService] Finding payment account by ID: ${id} from chart_of_accounts`);
        const chartAccount = await this.chartOfAccountRepository.findOne({
            where: { id, account_type: 9 },
        });
        if (!chartAccount) {
            console.log(`❌ [AccountsService] Payment account with ID ${id} not found`);
            throw new common_1.NotFoundException(`Payment account with ID ${id} not found`);
        }
        const account = {
            id: chartAccount.id,
            name: chartAccount.name,
            code: chartAccount.code,
            currency: null,
            balance: 0,
            status: 'active',
            created_at: chartAccount.created_at,
            updated_at: chartAccount.updated_at,
        };
        console.log(`✅ [AccountsService] Payment account found: ${account.name}`);
        return account;
    }
    async create(createAccountDto) {
        console.log('💰 [AccountsService] Creating new account:', createAccountDto.name);
        const account = this.accountRepository.create({
            name: createAccountDto.name,
            code: createAccountDto.code,
            currency: createAccountDto.currency ?? null,
            balance: createAccountDto.balance ?? 0,
            status: createAccountDto.status ?? 'active',
        });
        const savedAccount = await this.accountRepository.save(account);
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
            }
            catch (e) {
                console.warn('⚠️ [AccountsService] Skipping initial ledger entry (table may not exist):', e.message);
            }
        }
        console.log(`✅ [AccountsService] Account created with ID: ${savedAccount.id}`);
        return this.findOne(savedAccount.id);
    }
    async update(id, updateAccountDto) {
        console.log(`💰 [AccountsService] Updating account ID: ${id}`);
        const account = await this.findOne(id);
        if (updateAccountDto.name !== undefined)
            account.name = updateAccountDto.name;
        if (updateAccountDto.code !== undefined)
            account.code = updateAccountDto.code;
        if (updateAccountDto.currency !== undefined)
            account.currency = updateAccountDto.currency ?? null;
        if (updateAccountDto.balance !== undefined)
            account.balance = updateAccountDto.balance;
        if (updateAccountDto.status !== undefined)
            account.status = updateAccountDto.status;
        const updatedAccount = await this.accountRepository.save(account);
        console.log(`✅ [AccountsService] Account updated: ${updatedAccount.name}`);
        return this.findOne(updatedAccount.id);
    }
    async remove(id) {
        console.log(`💰 [AccountsService] Deleting account ID: ${id}`);
        const account = await this.findOne(id);
        await this.accountRepository.remove(account);
        console.log(`✅ [AccountsService] Account deleted: ${account.name}`);
    }
    async getAccountBalance(accountId) {
        try {
            const latestLedger = await this.accountLedgerRepository.findOne({
                where: { account_id: accountId },
                order: { transactionDate: 'DESC', createdAt: 'DESC' },
            });
            return latestLedger ? Number(latestLedger.balance) : 0;
        }
        catch {
            return 0;
        }
    }
    async getAccountLedger(accountId) {
        try {
            return await this.accountLedgerRepository.find({
                where: { account_id: accountId },
                order: { transactionDate: 'DESC', createdAt: 'DESC' },
            });
        }
        catch {
            return [];
        }
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(1, (0, typeorm_1.InjectRepository)(account_ledger_entity_1.AccountLedger)),
    __param(2, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map