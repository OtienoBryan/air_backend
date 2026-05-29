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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_entity_1 = require("../entities/payroll.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const staff_entity_1 = require("../entities/staff.entity");
let PayrollService = class PayrollService {
    payrollRepository;
    chartOfAccountRepository;
    journalEntryRepository;
    journalEntryLineRepository;
    staffRepository;
    dataSource;
    constructor(payrollRepository, chartOfAccountRepository, journalEntryRepository, journalEntryLineRepository, staffRepository, dataSource) {
        this.payrollRepository = payrollRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.staffRepository = staffRepository;
        this.dataSource = dataSource;
    }
    async findAll(page = 1, limit = 50) {
        console.log('💼 [PayrollService] Finding all payroll records');
        console.log(`💼 [PayrollService] Page: ${page}, Limit: ${limit}`);
        const [payroll, total] = await this.payrollRepository.findAndCount({
            relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'staff'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [PayrollService] Found ${payroll.length} payroll records out of ${total} total`);
        return { payroll, total };
    }
    async findOne(id) {
        console.log(`💼 [PayrollService] Finding payroll by ID: ${id}`);
        const payroll = await this.payrollRepository.findOne({
            where: { id },
            relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'staff'],
        });
        if (!payroll) {
            console.log(`❌ [PayrollService] Payroll with ID ${id} not found`);
            throw new common_1.NotFoundException(`Payroll with ID ${id} not found`);
        }
        console.log(`✅ [PayrollService] Payroll found: ID ${payroll.id}, Journal Entry: ${payroll.journal_entry?.entry_number || 'N/A'}`);
        return payroll;
    }
    async generateEntryNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;
        console.log(`📝 [PayrollService] Generating entry number for date: ${datePrefix}`);
        const latestEntry = await this.journalEntryRepository.findOne({
            where: {
                entry_number: (0, typeorm_2.Like)(`JE-${datePrefix}-%`),
            },
            order: { entry_number: 'DESC' },
        });
        let sequence = 1;
        if (latestEntry) {
            console.log(`📝 [PayrollService] Found latest entry: ${latestEntry.entry_number}`);
            const parts = latestEntry.entry_number.split('-');
            if (parts.length === 3) {
                const lastSequence = parseInt(parts[2] || '0');
                sequence = lastSequence + 1;
                console.log(`📝 [PayrollService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
            }
        }
        else {
            console.log(`📝 [PayrollService] No previous entries found for today, starting with sequence 1`);
        }
        const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
        console.log(`📝 [PayrollService] Generated entry number: ${entryNumber}`);
        return entryNumber;
    }
    async create(createPayrollDto, createdBy = null) {
        console.log('💼 [PayrollService] ==========================================');
        console.log('💼 [PayrollService] Creating new payroll record');
        console.log('💼 [PayrollService] Payroll data:', JSON.stringify(createPayrollDto, null, 2));
        console.log('💼 [PayrollService] Created by user ID:', createdBy);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log(`💼 [PayrollService] Looking up payroll account ID: ${createPayrollDto.payroll_account_id}`);
            const payrollAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { id: createPayrollDto.payroll_account_id },
            });
            if (!payrollAccount) {
                console.log(`❌ [PayrollService] Payroll account with ID ${createPayrollDto.payroll_account_id} not found`);
                throw new common_1.NotFoundException(`Payroll account with ID ${createPayrollDto.payroll_account_id} not found`);
            }
            console.log(`✅ [PayrollService] Payroll account found: ${payrollAccount.name} (${payrollAccount.code})`);
            console.log(`💼 [PayrollService] Looking up staff ID: ${createPayrollDto.staff_id}`);
            const staff = await queryRunner.manager.findOne(staff_entity_1.Staff, {
                where: { id: createPayrollDto.staff_id },
            });
            if (!staff) {
                console.log(`❌ [PayrollService] Staff with ID ${createPayrollDto.staff_id} not found`);
                throw new common_1.NotFoundException(`Staff with ID ${createPayrollDto.staff_id} not found`);
            }
            console.log(`✅ [PayrollService] Staff found: ${staff.name} (${staff.empl_no})`);
            console.log('💼 [PayrollService] Creating journal entry...');
            const journalEntry = await this.createJournalEntryWithTransaction(createPayrollDto, createdBy, payrollAccount, queryRunner);
            console.log(`✅ [PayrollService] Journal entry created: ${journalEntry.entry_number} (ID: ${journalEntry.id})`);
            console.log('💼 [PayrollService] Creating payroll record...');
            const payroll = queryRunner.manager.create(payroll_entity_1.Payroll, {
                journal_entry_id: journalEntry.id,
                staff_id: createPayrollDto.staff_id,
                payroll_date: new Date(createPayrollDto.payroll_date),
                amount: createPayrollDto.amount,
                description: createPayrollDto.description,
                reference: createPayrollDto.reference,
            });
            const savedPayroll = await queryRunner.manager.save(payroll_entity_1.Payroll, payroll);
            console.log(`✅ [PayrollService] Payroll created with ID: ${savedPayroll.id}`);
            console.log(`✅ [PayrollService] Payroll references journal entry: ${journalEntry.entry_number}`);
            await queryRunner.commitTransaction();
            console.log('✅ [PayrollService] Transaction committed successfully');
            console.log('💼 [PayrollService] ==========================================');
            return this.findOne(savedPayroll.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ [PayrollService] Transaction rolled back due to error:', error);
            console.log('💼 [PayrollService] ==========================================');
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createJournalEntryWithTransaction(createPayrollDto, createdBy, payrollAccount, queryRunner) {
        console.log('📝 [PayrollService] ==========================================');
        console.log('📝 [PayrollService] Creating journal entry for payroll');
        console.log('📝 [PayrollService] Payroll account:', payrollAccount.name, `(${payrollAccount.code})`);
        console.log('📝 [PayrollService] Amount:', createPayrollDto.amount);
        console.log('📝 [PayrollService] Is paid:', createPayrollDto.is_paid);
        console.log('📝 [PayrollService] Payment method:', createPayrollDto.payment_method || 'N/A');
        console.log('📝 [PayrollService] Generating entry number...');
        const entryNumber = await this.generateEntryNumber();
        console.log(`📝 [PayrollService] Generated entry number: ${entryNumber}`);
        let creditAccount = null;
        if (createPayrollDto.is_paid) {
            if (!createPayrollDto.payment_method) {
                console.log(`❌ [PayrollService] Payment method is required when payroll is marked as paid`);
                throw new common_1.NotFoundException(`Payment method is required when payroll is marked as paid`);
            }
            console.log(`📝 [PayrollService] Looking up payment method account: code=${createPayrollDto.payment_method}, type=9`);
            creditAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { code: createPayrollDto.payment_method, account_type: 9 },
            });
            if (!creditAccount) {
                console.log(`❌ [PayrollService] Payment method account with code ${createPayrollDto.payment_method} not found`);
                throw new common_1.NotFoundException(`Payment method account with code ${createPayrollDto.payment_method} not found`);
            }
            console.log(`✅ [PayrollService] Payment method account found: ${creditAccount.name} (${creditAccount.code})`);
        }
        else {
            console.log('📝 [PayrollService] Payroll not paid, looking up accounts payable account (type=10)...');
            creditAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { account_type: 10 },
            });
            if (!creditAccount) {
                console.log(`❌ [PayrollService] Accounts payable account not found. Please ensure an accounts payable account exists in chart_of_accounts`);
                throw new common_1.NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
            }
            console.log(`✅ [PayrollService] Accounts payable account found: ${creditAccount.name} (${creditAccount.code})`);
        }
        console.log('📝 [PayrollService] Creating journal entry record...');
        const journalEntry = queryRunner.manager.create(journal_entry_entity_1.JournalEntry, {
            entry_number: entryNumber,
            entry_date: new Date(createPayrollDto.payroll_date),
            reference: createPayrollDto.reference,
            description: createPayrollDto.description || `Payroll: ${payrollAccount.name}`,
            total_debit: createPayrollDto.amount,
            total_credit: createPayrollDto.amount,
            status: 'posted',
            created_by: createdBy || 1,
        });
        console.log('📝 [PayrollService] Journal entry data:', {
            entry_number: journalEntry.entry_number,
            entry_date: journalEntry.entry_date,
            reference: journalEntry.reference,
            total_debit: journalEntry.total_debit,
            total_credit: journalEntry.total_credit,
            status: journalEntry.status,
            created_by: journalEntry.created_by
        });
        const savedJournalEntry = await queryRunner.manager.save(journal_entry_entity_1.JournalEntry, journalEntry);
        console.log(`✅ [PayrollService] Journal entry saved with ID: ${savedJournalEntry.id}`);
        console.log('📝 [PayrollService] Creating journal entry lines...');
        console.log(`📝 [PayrollService] Creating debit line: Account ${payrollAccount.name}, Amount: ${createPayrollDto.amount}`);
        const debitLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: createPayrollDto.payroll_account_id,
            debit_amount: createPayrollDto.amount,
            credit_amount: 0,
            description: createPayrollDto.description || `Payroll: ${payrollAccount.name}`,
        });
        console.log(`📝 [PayrollService] Creating credit line: Account ${creditAccount.name}, Amount: ${createPayrollDto.amount}`);
        const creditLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: creditAccount.id,
            debit_amount: 0,
            credit_amount: createPayrollDto.amount,
            description: createPayrollDto.is_paid
                ? `Payment via ${creditAccount.name}`
                : `Accounts Payable: ${createPayrollDto.description || 'Payroll'}`,
        });
        const savedLines = await queryRunner.manager.save(journal_entry_line_entity_1.JournalEntryLine, [debitLine, creditLine]);
        console.log(`✅ [PayrollService] Journal entry lines created:`);
        console.log(`   - Debit line ID: ${savedLines[0].id}, Account: ${payrollAccount.name}, Amount: ${savedLines[0].debit_amount}`);
        console.log(`   - Credit line ID: ${savedLines[1].id}, Account: ${creditAccount.name}, Amount: ${savedLines[1].credit_amount}`);
        console.log(`✅ [PayrollService] Journal entry ${savedJournalEntry.entry_number} completed successfully`);
        console.log('📝 [PayrollService] ==========================================');
        return savedJournalEntry;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_entity_1.Payroll)),
    __param(1, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(4, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map