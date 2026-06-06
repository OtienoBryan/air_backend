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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("../entities/expense.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
let ExpensesService = class ExpensesService {
    expenseRepository;
    chartOfAccountRepository;
    journalEntryRepository;
    journalEntryLineRepository;
    supplierRepository;
    supplierLedgerRepository;
    dataSource;
    constructor(expenseRepository, chartOfAccountRepository, journalEntryRepository, journalEntryLineRepository, supplierRepository, supplierLedgerRepository, dataSource) {
        this.expenseRepository = expenseRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.supplierRepository = supplierRepository;
        this.supplierLedgerRepository = supplierLedgerRepository;
        this.dataSource = dataSource;
    }
    async findAll(page = 1, limit = 50) {
        console.log('💰 [ExpensesService] Finding all expenses');
        console.log(`💰 [ExpensesService] Page: ${page}, Limit: ${limit}`);
        const [expenses, total] = await this.expenseRepository.findAndCount({
            relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'supplier', 'expense_type', 'expense_type.category', 'route', 'route.fromDestination', 'route.toDestination', 'aircraft', 'flight', 'flight.series'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [ExpensesService] Found ${expenses.length} expenses out of ${total} total`);
        expenses.forEach((expense, index) => {
            console.log(`   [${index + 1}] Expense ID: ${expense.id}, Journal Entry: ${expense.journal_entry?.entry_number || 'N/A'}`);
        });
        return { expenses, total };
    }
    async findOne(id) {
        console.log(`💰 [ExpensesService] Finding expense by ID: ${id}`);
        const expense = await this.expenseRepository.findOne({
            where: { id },
            relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'supplier', 'expense_type', 'expense_type.category', 'route', 'route.fromDestination', 'route.toDestination', 'aircraft', 'flight', 'flight.series'],
        });
        if (!expense) {
            console.log(`❌ [ExpensesService] Expense with ID ${id} not found`);
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        console.log(`✅ [ExpensesService] Expense found: ID ${expense.id}, Journal Entry: ${expense.journal_entry?.entry_number || 'N/A'}`);
        if (expense.journal_entry) {
            console.log(`   Journal Entry Details:`);
            console.log(`   - Entry Number: ${expense.journal_entry.entry_number}`);
            console.log(`   - Date: ${expense.journal_entry.entry_date}`);
            console.log(`   - Total Debit: ${expense.journal_entry.total_debit}`);
            console.log(`   - Total Credit: ${expense.journal_entry.total_credit}`);
            console.log(`   - Lines: ${expense.journal_entry.lines?.length || 0}`);
        }
        return expense;
    }
    async generateEntryNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;
        console.log(`📝 [ExpensesService] Generating entry number for date: ${datePrefix}`);
        const latestEntry = await this.journalEntryRepository.findOne({
            where: {
                entry_number: (0, typeorm_2.Like)(`JE-${datePrefix}-%`),
            },
            order: { entry_number: 'DESC' },
        });
        let sequence = 1;
        if (latestEntry) {
            console.log(`📝 [ExpensesService] Found latest entry: ${latestEntry.entry_number}`);
            const parts = latestEntry.entry_number.split('-');
            if (parts.length === 3) {
                const lastSequence = parseInt(parts[2] || '0');
                sequence = lastSequence + 1;
                console.log(`📝 [ExpensesService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
            }
        }
        else {
            console.log(`📝 [ExpensesService] No previous entries found for today, starting with sequence 1`);
        }
        const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
        console.log(`📝 [ExpensesService] Generated entry number: ${entryNumber}`);
        return entryNumber;
    }
    async create(createExpenseDto, createdBy = null) {
        console.log('💰 [ExpensesService] ==========================================');
        console.log('💰 [ExpensesService] Creating new expense');
        console.log('💰 [ExpensesService] Expense data:', JSON.stringify(createExpenseDto, null, 2));
        console.log('💰 [ExpensesService] Created by user ID:', createdBy);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log(`💰 [ExpensesService] Looking up expense account ID: ${createExpenseDto.expense_account_id}, type: 16`);
            const expenseAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { id: createExpenseDto.expense_account_id, account_type: 16 },
            });
            if (!expenseAccount) {
                console.log(`❌ [ExpensesService] Expense account with ID ${createExpenseDto.expense_account_id} not found or not an expense account (type 16)`);
                throw new common_1.NotFoundException(`Expense account with ID ${createExpenseDto.expense_account_id} not found or not an expense account`);
            }
            console.log(`✅ [ExpensesService] Expense account found: ${expenseAccount.name} (${expenseAccount.code})`);
            console.log('💰 [ExpensesService] Creating journal entry...');
            const journalEntry = await this.createJournalEntryWithTransaction(createExpenseDto, createdBy, expenseAccount, queryRunner);
            console.log(`✅ [ExpensesService] Journal entry created: ${journalEntry.entry_number} (ID: ${journalEntry.id})`);
            let supplier = null;
            if (createExpenseDto.supplier_id) {
                console.log(`💰 [ExpensesService] Looking up supplier ID: ${createExpenseDto.supplier_id}`);
                supplier = await queryRunner.manager.findOne(supplier_entity_1.Supplier, {
                    where: { id: createExpenseDto.supplier_id },
                });
                if (!supplier) {
                    console.log(`❌ [ExpensesService] Supplier with ID ${createExpenseDto.supplier_id} not found`);
                    throw new common_1.NotFoundException(`Supplier with ID ${createExpenseDto.supplier_id} not found`);
                }
                console.log(`✅ [ExpensesService] Supplier found: ${supplier.company_name} (${supplier.supplier_code})`);
            }
            console.log('💰 [ExpensesService] Creating expense record...');
            const totalAmount = createExpenseDto.amount;
            const amountPaid = createExpenseDto.is_paid ? totalAmount : 0;
            const balance = totalAmount - amountPaid;
            const expense = queryRunner.manager.create(expense_entity_1.Expense, {
                journal_entry_id: journalEntry.id,
                supplier_id: createExpenseDto.supplier_id || null,
                expense_type_id: createExpenseDto.expense_type_id || null,
                amount_paid: amountPaid,
                balance: balance,
                linked_to: createExpenseDto.linked_to || null,
                route_id: createExpenseDto.route_id || null,
                aircraft_id: createExpenseDto.aircraft_id || null,
                flight_id: createExpenseDto.flight_id || null,
                cost_center: createExpenseDto.cost_center || null,
            });
            const savedExpense = await queryRunner.manager.save(expense_entity_1.Expense, expense);
            console.log(`✅ [ExpensesService] Expense created with ID: ${savedExpense.id}`);
            console.log(`✅ [ExpensesService] Expense references journal entry: ${journalEntry.entry_number}`);
            console.log(`✅ [ExpensesService] Amount paid: ${amountPaid}, Balance: ${balance}`);
            if (supplier) {
                console.log(`💰 [ExpensesService] Creating supplier ledger entry for supplier: ${supplier.company_name}`);
                const latestLedger = await queryRunner.manager.findOne(supplier_ledger_entity_1.SupplierLedger, {
                    where: { supplierId: supplier.id },
                    order: { date: 'DESC', createdAt: 'DESC' },
                });
                const currentSupplierBalance = latestLedger ? Number(latestLedger.runningBalance) : 0;
                const updatedSupplierBalance = currentSupplierBalance + totalAmount;
                const supplierLedgerEntry = queryRunner.manager.create(supplier_ledger_entity_1.SupplierLedger, {
                    supplierId: supplier.id,
                    date: new Date(createExpenseDto.expense_date),
                    description: createExpenseDto.description || `Expense - ${journalEntry.entry_number}`,
                    debit: 0,
                    credit: totalAmount,
                    runningBalance: updatedSupplierBalance,
                    referenceType: 'EXPENSE',
                    referenceId: savedExpense.id,
                });
                await queryRunner.manager.save(supplier_ledger_entity_1.SupplierLedger, supplierLedgerEntry);
                console.log(`✅ [ExpensesService] Supplier ledger entry created with reference: EXPENSE-${savedExpense.id}`);
                console.log(`✅ [ExpensesService] Supplier balance updated: ${currentSupplierBalance} -> ${updatedSupplierBalance}`);
            }
            await queryRunner.commitTransaction();
            console.log('✅ [ExpensesService] Transaction committed successfully');
            console.log('💰 [ExpensesService] ==========================================');
            return this.findOne(savedExpense.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ [ExpensesService] Transaction rolled back due to error:', error);
            console.log('💰 [ExpensesService] ==========================================');
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createJournalEntry(createExpenseDto, createdBy, expenseAccount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const journalEntry = await this.createJournalEntryWithTransaction(createExpenseDto, createdBy, expenseAccount, queryRunner);
            await queryRunner.commitTransaction();
            return journalEntry;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createJournalEntryWithTransaction(createExpenseDto, createdBy, expenseAccount, queryRunner) {
        console.log('📝 [ExpensesService] ==========================================');
        console.log('📝 [ExpensesService] Creating journal entry for expense');
        console.log('📝 [ExpensesService] Expense account:', expenseAccount.name, `(${expenseAccount.code})`);
        console.log('📝 [ExpensesService] Amount:', createExpenseDto.amount);
        console.log('📝 [ExpensesService] Is paid:', createExpenseDto.is_paid);
        console.log('📝 [ExpensesService] Payment method:', createExpenseDto.payment_method || 'N/A');
        console.log('📝 [ExpensesService] Generating entry number...');
        const entryNumber = await this.generateEntryNumber();
        console.log(`📝 [ExpensesService] Generated entry number: ${entryNumber}`);
        let creditAccount = null;
        if (createExpenseDto.is_paid) {
            if (!createExpenseDto.payment_method) {
                console.log(`❌ [ExpensesService] Payment method is required when expense is marked as paid`);
                throw new common_1.NotFoundException(`Payment method is required when expense is marked as paid`);
            }
            console.log(`📝 [ExpensesService] Looking up payment method account: code=${createExpenseDto.payment_method}, type=9`);
            creditAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { code: createExpenseDto.payment_method, account_type: 9 },
            });
            if (!creditAccount) {
                console.log(`❌ [ExpensesService] Payment method account with code ${createExpenseDto.payment_method} not found`);
                throw new common_1.NotFoundException(`Payment method account with code ${createExpenseDto.payment_method} not found`);
            }
            console.log(`✅ [ExpensesService] Payment method account found: ${creditAccount.name} (${creditAccount.code})`);
        }
        else {
            console.log('📝 [ExpensesService] Expense not paid, looking up accounts payable account (type=10)...');
            creditAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                where: { account_type: 10 },
            });
            if (!creditAccount) {
                console.log(`❌ [ExpensesService] Accounts payable account not found. Please ensure an accounts payable account exists in chart_of_accounts`);
                throw new common_1.NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
            }
            console.log(`✅ [ExpensesService] Accounts payable account found: ${creditAccount.name} (${creditAccount.code})`);
        }
        console.log('📝 [ExpensesService] Creating journal entry record...');
        const journalEntry = queryRunner.manager.create(journal_entry_entity_1.JournalEntry, {
            entry_number: entryNumber,
            entry_date: new Date(createExpenseDto.expense_date),
            reference: createExpenseDto.reference,
            description: createExpenseDto.description || `Expense: ${expenseAccount.name}`,
            total_debit: createExpenseDto.amount,
            total_credit: createExpenseDto.amount,
            status: 'posted',
            created_by: createdBy || 1,
        });
        console.log('📝 [ExpensesService] Journal entry data:', {
            entry_number: journalEntry.entry_number,
            entry_date: journalEntry.entry_date,
            reference: journalEntry.reference,
            total_debit: journalEntry.total_debit,
            total_credit: journalEntry.total_credit,
            status: journalEntry.status,
            created_by: journalEntry.created_by
        });
        const savedJournalEntry = await queryRunner.manager.save(journal_entry_entity_1.JournalEntry, journalEntry);
        console.log(`✅ [ExpensesService] Journal entry saved with ID: ${savedJournalEntry.id}`);
        console.log('📝 [ExpensesService] Creating journal entry lines...');
        console.log(`📝 [ExpensesService] Creating debit line: Account ${expenseAccount.name}, Amount: ${createExpenseDto.amount}`);
        const debitLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: createExpenseDto.expense_account_id,
            debit_amount: createExpenseDto.amount,
            credit_amount: 0,
            description: createExpenseDto.description || `Expense: ${expenseAccount.name}`,
        });
        console.log(`📝 [ExpensesService] Creating credit line: Account ${creditAccount.name}, Amount: ${createExpenseDto.amount}`);
        const creditLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: creditAccount.id,
            debit_amount: 0,
            credit_amount: createExpenseDto.amount,
            description: createExpenseDto.is_paid
                ? `Payment via ${creditAccount.name}`
                : `Accounts Payable: ${createExpenseDto.description || 'Expense'}`,
        });
        const savedLines = await queryRunner.manager.save(journal_entry_line_entity_1.JournalEntryLine, [debitLine, creditLine]);
        console.log(`✅ [ExpensesService] Journal entry lines created:`);
        console.log(`   - Debit line ID: ${savedLines[0].id}, Account: ${expenseAccount.name}, Amount: ${savedLines[0].debit_amount}`);
        console.log(`   - Credit line ID: ${savedLines[1].id}, Account: ${creditAccount.name}, Amount: ${savedLines[1].credit_amount}`);
        console.log(`✅ [ExpensesService] Journal entry ${savedJournalEntry.entry_number} completed successfully`);
        console.log('📝 [ExpensesService] ==========================================');
        return savedJournalEntry;
    }
    async updatePayment(id, updateExpenseDto) {
        console.log('💰 [ExpensesService] ==========================================');
        console.log('💰 [ExpensesService] Updating payment for expense');
        console.log(`💰 [ExpensesService] Expense ID: ${id}`);
        console.log('💰 [ExpensesService] Update data:', JSON.stringify(updateExpenseDto, null, 2));
        const expense = await this.findOne(id);
        if (!expense.journal_entry) {
            console.log(`❌ [ExpensesService] Expense ${id} has no journal entry`);
            throw new common_1.NotFoundException(`Expense ${id} has no journal entry`);
        }
        const journalEntry = expense.journal_entry;
        const totalAmount = journalEntry.total_debit;
        const currentAmountPaid = Number(expense.amount_paid || 0);
        const currentBalance = Number(expense.balance || totalAmount);
        const paymentAmount = updateExpenseDto.amount;
        if (paymentAmount <= 0) {
            throw new common_1.NotFoundException(`Payment amount must be greater than 0`);
        }
        if (paymentAmount > currentBalance) {
            throw new common_1.NotFoundException(`Payment amount (${paymentAmount}) cannot exceed balance (${currentBalance})`);
        }
        if (!updateExpenseDto.payment_method) {
            console.log(`❌ [ExpensesService] Payment method is required`);
            throw new common_1.NotFoundException(`Payment method is required`);
        }
        console.log(`📝 [ExpensesService] Looking up payment method account: code=${updateExpenseDto.payment_method}, type=9`);
        const paymentMethodAccount = await this.chartOfAccountRepository.findOne({
            where: { code: updateExpenseDto.payment_method, account_type: 9 },
        });
        if (!paymentMethodAccount) {
            console.log(`❌ [ExpensesService] Payment method account with code ${updateExpenseDto.payment_method} not found`);
            throw new common_1.NotFoundException(`Payment method account with code ${updateExpenseDto.payment_method} not found`);
        }
        console.log(`✅ [ExpensesService] Payment method account found: ${paymentMethodAccount.name} (${paymentMethodAccount.code})`);
        const accountsPayableAccount = await this.chartOfAccountRepository.findOne({
            where: { account_type: 10 },
        });
        if (!accountsPayableAccount) {
            console.log(`❌ [ExpensesService] Accounts payable account not found`);
            throw new common_1.NotFoundException(`Accounts payable account not found`);
        }
        console.log(`📝 [ExpensesService] Creating payment journal entry for amount: ${paymentAmount}`);
        const paymentEntryNumber = await this.generateEntryNumber();
        const paymentJournalEntry = this.journalEntryRepository.create({
            entry_number: paymentEntryNumber,
            entry_date: new Date(),
            reference: journalEntry.reference,
            description: `Payment for expense: ${journalEntry.description || 'N/A'}`,
            total_debit: paymentAmount,
            total_credit: paymentAmount,
            status: 'posted',
            created_by: 1,
        });
        const savedPaymentEntry = await this.journalEntryRepository.save(paymentJournalEntry);
        console.log(`✅ [ExpensesService] Payment journal entry created: ${savedPaymentEntry.entry_number}`);
        const debitLine = this.journalEntryLineRepository.create({
            journal_entry_id: savedPaymentEntry.id,
            account_id: accountsPayableAccount.id,
            debit_amount: paymentAmount,
            credit_amount: 0,
            description: `Payment reducing accounts payable`,
        });
        const creditLine = this.journalEntryLineRepository.create({
            journal_entry_id: savedPaymentEntry.id,
            account_id: paymentMethodAccount.id,
            debit_amount: 0,
            credit_amount: paymentAmount,
            description: `Payment via ${paymentMethodAccount.name}`,
        });
        await this.journalEntryLineRepository.save([debitLine, creditLine]);
        console.log(`✅ [ExpensesService] Payment journal entry lines created`);
        const newAmountPaid = currentAmountPaid + paymentAmount;
        const newBalance = currentBalance - paymentAmount;
        await this.expenseRepository.update(id, {
            amount_paid: newAmountPaid,
            balance: newBalance,
        });
        console.log(`✅ [ExpensesService] Expense updated: Amount Paid: ${newAmountPaid}, Balance: ${newBalance}`);
        console.log('💰 [ExpensesService] ==========================================');
        return this.findOne(id);
    }
    async getReport(groupBy, from, to) {
        const qb = this.expenseRepository.createQueryBuilder('expense')
            .leftJoinAndSelect('expense.journal_entry', 'je')
            .leftJoinAndSelect('je.lines', 'lines')
            .leftJoinAndSelect('lines.account', 'account')
            .leftJoinAndSelect('expense.expense_type', 'expense_type')
            .leftJoinAndSelect('expense_type.category', 'expense_type_category')
            .leftJoinAndSelect('expense.supplier', 'supplier');
        if (from)
            qb.andWhere('DATE(je.entry_date) >= :from', { from });
        if (to)
            qb.andWhere('DATE(je.entry_date) <= :to', { to });
        if (groupBy === 'route') {
            qb.andWhere('expense.linked_to = :lt', { lt: 'route' })
                .leftJoinAndSelect('expense.route', 'route')
                .leftJoinAndSelect('route.fromDestination', 'fromDest')
                .leftJoinAndSelect('route.toDestination', 'toDest');
        }
        else if (groupBy === 'aircraft') {
            qb.andWhere('expense.linked_to = :lt', { lt: 'aircraft' })
                .leftJoinAndSelect('expense.aircraft', 'aircraft');
        }
        else if (groupBy === 'flight') {
            qb.andWhere('expense.linked_to = :lt', { lt: 'flight' })
                .leftJoinAndSelect('expense.flight', 'flight')
                .leftJoinAndSelect('flight.series', 'series');
        }
        qb.orderBy('je.entry_date', 'DESC');
        const expenses = await qb.getMany();
        const groupsMap = new Map();
        for (const expense of expenses) {
            let key;
            let label;
            let meta;
            if (groupBy === 'route') {
                key = expense.route_id ?? 'none';
                const r = expense.route;
                label = r
                    ? `${r.fromDestination?.name ?? r.from_destination_id} → ${r.toDestination?.name ?? r.to_destination_id}`
                    : 'Unknown Route';
                meta = r;
            }
            else if (groupBy === 'aircraft') {
                key = expense.aircraft_id ?? 'none';
                const a = expense.aircraft;
                label = a ? `${a.name} · ${a.registration}` : 'Unknown Aircraft';
                meta = a;
            }
            else if (groupBy === 'flight') {
                key = expense.flight_id ?? 'none';
                const f = expense.flight;
                label = f ? `${f.flight_no} · ${f.flight_date}` : 'Unknown Flight';
                meta = f;
            }
            else {
                key = expense.expense_type_id ?? 0;
                const t = expense.expense_type;
                label = t ? t.name : 'Uncategorized';
                meta = t;
            }
            if (!groupsMap.has(key)) {
                groupsMap.set(key, { id: key, label, meta, total_amount: 0, total_paid: 0, balance: 0, count: 0, expenses: [] });
            }
            const g = groupsMap.get(key);
            g.total_amount += Number(expense.journal_entry?.total_debit ?? 0);
            g.total_paid += Number(expense.amount_paid ?? 0);
            g.balance += Number(expense.balance ?? 0);
            g.count++;
            g.expenses.push(expense);
        }
        return Array.from(groupsMap.values()).sort((a, b) => b.total_amount - a.total_amount);
    }
    async getPaymentHistory(id) {
        console.log('💰 [ExpensesService] ==========================================');
        console.log('💰 [ExpensesService] Getting payment history for expense');
        console.log(`💰 [ExpensesService] Expense ID: ${id}`);
        const expense = await this.findOne(id);
        if (!expense.journal_entry) {
            console.log(`❌ [ExpensesService] Expense ${id} has no journal entry`);
            throw new common_1.NotFoundException(`Expense ${id} has no journal entry`);
        }
        const expenseReference = expense.journal_entry.reference;
        const expenseJournalEntryId = expense.journal_entry_id;
        console.log(`📝 [ExpensesService] Finding payment journal entries with reference: ${expenseReference}`);
        if (!expenseReference) {
            console.log(`⚠️ [ExpensesService] Expense has no reference, returning empty payment history`);
            return [];
        }
        const paymentEntries = await this.journalEntryRepository.find({
            where: { reference: expenseReference },
            relations: ['lines', 'lines.account'],
            order: { entry_date: 'DESC', created_at: 'DESC' },
        });
        const paymentHistory = paymentEntries.filter(entry => {
            if (entry.id === expenseJournalEntryId) {
                return false;
            }
            const hasPaymentMethod = entry.lines?.some(line => line.credit_amount > 0 && line.account?.account_type === 9);
            return hasPaymentMethod;
        });
        console.log(`✅ [ExpensesService] Found ${paymentHistory.length} payment entries`);
        paymentHistory.forEach((entry, index) => {
            const paymentLine = entry.lines?.find(line => line.credit_amount > 0 && line.account?.account_type === 9);
            console.log(`   [${index + 1}] Entry: ${entry.entry_number}, Amount: ${entry.total_credit}, Payment Method: ${paymentLine?.account?.name || 'N/A'}, Date: ${entry.entry_date}`);
        });
        console.log('💰 [ExpensesService] ==========================================');
        return paymentHistory;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(1, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(5, (0, typeorm_1.InjectRepository)(supplier_ledger_entity_1.SupplierLedger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map