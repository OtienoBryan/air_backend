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
exports.FuelingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fueling_entity_1 = require("../entities/fueling.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
const account_ledger_entity_1 = require("../entities/account-ledger.entity");
const account_entity_1 = require("../entities/account.entity");
let FuelingService = class FuelingService {
    fuelingRepository;
    flightSeriesRepository;
    supplierRepository;
    chartOfAccountRepository;
    journalEntryRepository;
    journalEntryLineRepository;
    supplierLedgerRepository;
    accountLedgerRepository;
    accountRepository;
    dataSource;
    constructor(fuelingRepository, flightSeriesRepository, supplierRepository, chartOfAccountRepository, journalEntryRepository, journalEntryLineRepository, supplierLedgerRepository, accountLedgerRepository, accountRepository, dataSource) {
        this.fuelingRepository = fuelingRepository;
        this.flightSeriesRepository = flightSeriesRepository;
        this.supplierRepository = supplierRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.supplierLedgerRepository = supplierLedgerRepository;
        this.accountLedgerRepository = accountLedgerRepository;
        this.accountRepository = accountRepository;
        this.dataSource = dataSource;
    }
    async findAll(page = 1, limit = 50) {
        console.log('⛽ [FuelingService] Finding all fuelings');
        console.log(`⛽ [FuelingService] Page: ${page}, Limit: ${limit}`);
        const [fuelings, total] = await this.fuelingRepository.findAndCount({
            relations: ['flightSeries', 'flightSeries.aircraft', 'supplier', 'journal_entry'],
            order: { fueling_date: 'DESC', created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [FuelingService] Found ${fuelings.length} fuelings out of ${total} total`);
        return { fuelings, total };
    }
    async findOne(id) {
        console.log(`⛽ [FuelingService] Finding fueling by ID: ${id}`);
        const fueling = await this.fuelingRepository.findOne({
            where: { id },
            relations: ['flightSeries', 'flightSeries.aircraft', 'supplier', 'journal_entry', 'journal_entry.lines', 'journal_entry.lines.account'],
        });
        if (!fueling) {
            console.log(`❌ [FuelingService] Fueling with ID ${id} not found`);
            throw new common_1.NotFoundException(`Fueling with ID ${id} not found`);
        }
        console.log(`✅ [FuelingService] Fueling found: ID ${fueling.id}`);
        return fueling;
    }
    async generateEntryNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;
        console.log(`📝 [FuelingService] Generating entry number for date: ${datePrefix}`);
        const latestEntry = await this.journalEntryRepository.findOne({
            where: {
                entry_number: (0, typeorm_2.Like)(`JE-${datePrefix}-%`),
            },
            order: { entry_number: 'DESC' },
        });
        let sequence = 1;
        if (latestEntry) {
            console.log(`📝 [FuelingService] Found latest entry: ${latestEntry.entry_number}`);
            const parts = latestEntry.entry_number.split('-');
            if (parts.length === 3) {
                const lastSequence = parseInt(parts[2] || '0');
                sequence = lastSequence + 1;
                console.log(`📝 [FuelingService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
            }
        }
        else {
            console.log(`📝 [FuelingService] No previous entries found for today, starting with sequence 1`);
        }
        const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
        console.log(`📝 [FuelingService] Generated entry number: ${entryNumber}`);
        return entryNumber;
    }
    async create(createFuelingDto, createdBy = null) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const [existingFueling, flightSeries, supplier, fuelAccount, accountsPayableAccount] = await Promise.all([
                this.fuelingRepository.findOne({
                    where: { fuel_slip_number: createFuelingDto.fuel_slip_number },
                }),
                this.flightSeriesRepository.findOne({
                    where: { id: createFuelingDto.flight_series_id },
                }),
                this.supplierRepository.findOne({
                    where: { id: createFuelingDto.supplier_id },
                }),
                this.chartOfAccountRepository
                    .createQueryBuilder('account')
                    .where('LOWER(account.name) = LOWER(:name)', { name: 'Aircraft Fueling' })
                    .andWhere('account.account_type = :accountType', { accountType: 16 })
                    .getOne(),
                this.chartOfAccountRepository.findOne({
                    where: { account_type: 10 },
                }),
            ]);
            if (existingFueling) {
                throw new common_1.NotFoundException(`Fueling with slip number ${createFuelingDto.fuel_slip_number} already exists. Please use a different slip number.`);
            }
            if (!flightSeries) {
                throw new common_1.NotFoundException(`Flight series with ID ${createFuelingDto.flight_series_id} not found`);
            }
            if (!supplier) {
                throw new common_1.NotFoundException(`Supplier with ID ${createFuelingDto.supplier_id} not found`);
            }
            if (!fuelAccount) {
                throw new common_1.NotFoundException(`Aircraft Fueling account not found. Please configure an account named "Aircraft Fueling" in chart_of_accounts`);
            }
            if (!accountsPayableAccount) {
                throw new common_1.NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
            }
            const additionalFees = createFuelingDto.additional_fees || 0;
            const tax = createFuelingDto.tax || 0;
            const fuelCost = createFuelingDto.fuel_quantity * createFuelingDto.price_per_liter;
            const subtotal = fuelCost + additionalFees;
            const totalAmount = subtotal + tax;
            let purchaseTaxAccount = null;
            let accruedLiabilitiesAccount = null;
            if (tax > 0) {
                [purchaseTaxAccount, accruedLiabilitiesAccount] = await Promise.all([
                    this.chartOfAccountRepository.findOne({
                        where: { code: '110004' },
                    }),
                    this.chartOfAccountRepository
                        .createQueryBuilder('account')
                        .where('LOWER(account.name) = LOWER(:name)', { name: 'Accrued Liabilities' })
                        .getOne(),
                ]);
                if (!purchaseTaxAccount) {
                    throw new common_1.NotFoundException(`Purchase Tax account (code: 110004) not found. Please configure this account in chart_of_accounts`);
                }
                if (!accruedLiabilitiesAccount) {
                    throw new common_1.NotFoundException(`Accrued Liabilities account not found. Please configure an account named "Accrued Liabilities" in chart_of_accounts`);
                }
            }
            const entryNumber = await this.generateEntryNumber();
            const journalEntry = queryRunner.manager.create(journal_entry_entity_1.JournalEntry, {
                entry_number: entryNumber,
                entry_date: new Date(createFuelingDto.fueling_date),
                reference: createFuelingDto.fuel_slip_number,
                description: `Fueling - ${flightSeries.flt} - ${supplier.company_name} - ${createFuelingDto.location}`,
                total_debit: totalAmount,
                total_credit: totalAmount,
                status: 'posted',
                created_by: createdBy || 1,
            });
            const savedJournalEntry = await queryRunner.manager.save(journal_entry_entity_1.JournalEntry, journalEntry);
            const journalEntryLines = [];
            journalEntryLines.push(queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                journal_entry_id: savedJournalEntry.id,
                account_id: fuelAccount.id,
                debit_amount: subtotal,
                credit_amount: 0,
                description: `Fueling - ${flightSeries.flt} - ${createFuelingDto.fuel_quantity}L @ ${createFuelingDto.price_per_liter}/L`,
            }));
            if (tax > 0 && purchaseTaxAccount) {
                journalEntryLines.push(queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                    journal_entry_id: savedJournalEntry.id,
                    account_id: purchaseTaxAccount.id,
                    debit_amount: tax,
                    credit_amount: 0,
                    description: `Purchase Tax - Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
                }));
            }
            journalEntryLines.push(queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                journal_entry_id: savedJournalEntry.id,
                account_id: accountsPayableAccount.id,
                debit_amount: 0,
                credit_amount: subtotal,
                description: `Fueling payable to ${supplier.company_name} - Slip: ${createFuelingDto.fuel_slip_number}`,
            }));
            if (tax > 0 && accruedLiabilitiesAccount) {
                journalEntryLines.push(queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                    journal_entry_id: savedJournalEntry.id,
                    account_id: accruedLiabilitiesAccount.id,
                    debit_amount: 0,
                    credit_amount: tax,
                    description: `Tax liability - Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
                }));
            }
            await queryRunner.manager.save(journal_entry_line_entity_1.JournalEntryLine, journalEntryLines);
            const latestSupplierLedger = await queryRunner.manager.findOne(supplier_ledger_entity_1.SupplierLedger, {
                where: { supplierId: supplier.id },
                order: { date: 'DESC', createdAt: 'DESC' },
            });
            const currentSupplierBalance = latestSupplierLedger ? Number(latestSupplierLedger.runningBalance) : 0;
            const updatedSupplierBalance = currentSupplierBalance + totalAmount;
            const supplierLedgerEntry = queryRunner.manager.create(supplier_ledger_entity_1.SupplierLedger, {
                supplierId: supplier.id,
                date: new Date(createFuelingDto.fueling_date),
                description: `Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
                debit: 0,
                credit: totalAmount,
                runningBalance: updatedSupplierBalance,
                referenceType: 'FUELING',
                referenceId: null,
            });
            await queryRunner.manager.save(supplier_ledger_entity_1.SupplierLedger, supplierLedgerEntry);
            const fueling = queryRunner.manager.create(fueling_entity_1.Fueling, {
                flight_series_id: createFuelingDto.flight_series_id,
                supplier_id: createFuelingDto.supplier_id,
                fuel_quantity: createFuelingDto.fuel_quantity,
                fuel_slip_number: createFuelingDto.fuel_slip_number,
                price_per_liter: createFuelingDto.price_per_liter,
                location: createFuelingDto.location,
                additional_fees: additionalFees,
                additional_fees_explanation: createFuelingDto.additional_fees_explanation || null,
                tax: tax,
                total_amount: totalAmount,
                fueling_date: new Date(createFuelingDto.fueling_date),
                journal_entry_id: savedJournalEntry.id,
            });
            const savedFueling = await queryRunner.manager.save(fueling_entity_1.Fueling, fueling);
            supplierLedgerEntry.referenceId = savedFueling.id;
            await queryRunner.manager.save(supplier_ledger_entity_1.SupplierLedger, supplierLedgerEntry);
            await queryRunner.commitTransaction();
            return this.fuelingRepository.findOne({
                where: { id: savedFueling.id },
                relations: ['flightSeries', 'supplier'],
            });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.FuelingService = FuelingService;
exports.FuelingService = FuelingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fueling_entity_1.Fueling)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_series_entity_1.FlightSeries)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(3, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __param(4, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(5, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(6, (0, typeorm_1.InjectRepository)(supplier_ledger_entity_1.SupplierLedger)),
    __param(7, (0, typeorm_1.InjectRepository)(account_ledger_entity_1.AccountLedger)),
    __param(8, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], FuelingService);
//# sourceMappingURL=fueling.service.js.map