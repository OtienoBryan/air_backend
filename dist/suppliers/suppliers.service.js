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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../entities/supplier.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
let SuppliersService = class SuppliersService {
    supplierRepository;
    supplierLedgerRepository;
    constructor(supplierRepository, supplierLedgerRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierLedgerRepository = supplierLedgerRepository;
    }
    async findAll(page = 1, limit = 10, search, status) {
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
        if (search) {
            queryBuilder.where('(supplier.company_name LIKE :search OR supplier.contact_person LIKE :search OR supplier.email LIKE :search OR supplier.supplier_code LIKE :search)', { search: `%${search}%` });
        }
        if (status === 'active') {
            queryBuilder.andWhere('supplier.is_active = :active', { active: true });
        }
        else if (status === 'inactive') {
            queryBuilder.andWhere('supplier.is_active = :active', { active: false });
        }
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        queryBuilder.orderBy('supplier.company_name', 'ASC');
        const [suppliers, total] = await queryBuilder.getManyAndCount();
        const supplierIds = suppliers.map(s => s.id);
        const balanceMap = new Map();
        if (supplierIds.length > 0) {
            const latestRows = await this.supplierLedgerRepository.query(`SELECT sl.supplier_id, sl.running_balance
         FROM supplier_ledger sl
         WHERE sl.id = (
           SELECT sl2.id FROM supplier_ledger sl2
           WHERE sl2.supplier_id = sl.supplier_id
           ORDER BY sl2.date DESC, sl2.created_at DESC, sl2.id DESC
           LIMIT 1
         )
         AND sl.supplier_id IN (${supplierIds.join(',')})`);
            for (const row of latestRows) {
                balanceMap.set(Number(row.supplier_id), Number(row.running_balance));
            }
        }
        const suppliersWithBalance = suppliers.map(s => ({
            ...s,
            current_balance: balanceMap.get(s.id) ?? 0,
        }));
        return { suppliers: suppliersWithBalance, total };
    }
    async findOne(id) {
        const supplier = await this.supplierRepository.findOne({ where: { id } });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        return supplier;
    }
    async findByCode(supplier_code) {
        return this.supplierRepository.findOne({ where: { supplier_code } });
    }
    async create(createSupplierDto) {
        const existingSupplier = await this.findByCode(createSupplierDto.supplier_code);
        if (existingSupplier) {
            throw new Error('Supplier code already exists');
        }
        const supplier = this.supplierRepository.create(createSupplierDto);
        return this.supplierRepository.save(supplier);
    }
    async update(id, updateSupplierDto) {
        const supplier = await this.findOne(id);
        if (updateSupplierDto.supplier_code && updateSupplierDto.supplier_code !== supplier.supplier_code) {
            const existingSupplier = await this.findByCode(updateSupplierDto.supplier_code);
            if (existingSupplier) {
                throw new Error('Supplier code already exists');
            }
        }
        Object.assign(supplier, updateSupplierDto);
        return this.supplierRepository.save(supplier);
    }
    async remove(id) {
        const supplier = await this.findOne(id);
        await this.supplierRepository.remove(supplier);
    }
    async getStats() {
        const total = await this.supplierRepository.count();
        const active = await this.supplierRepository.count({ where: { is_active: true } });
        const inactive = total - active;
        const result = await this.supplierRepository
            .createQueryBuilder('supplier')
            .select('SUM(supplier.credit_limit)', 'totalCreditLimit')
            .where('supplier.is_active = :active', { active: true })
            .getRawOne();
        return {
            total,
            active,
            inactive,
            totalCreditLimit: parseFloat(result.totalCreditLimit) || 0,
        };
    }
    async searchSuppliers(searchTerm) {
        if (!searchTerm) {
            return this.supplierRepository.find({ order: { company_name: 'ASC' } });
        }
        return this.supplierRepository.find({
            where: [
                { company_name: (0, typeorm_2.Like)(`%${searchTerm}%`) },
                { contact_person: (0, typeorm_2.Like)(`%${searchTerm}%`) },
                { email: (0, typeorm_2.Like)(`%${searchTerm}%`) },
                { supplier_code: (0, typeorm_2.Like)(`%${searchTerm}%`) },
            ],
            order: { company_name: 'ASC' },
        });
    }
    async getPayablesAging() {
        console.log('📊 [SuppliersService] Calculating payables aging analysis');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const suppliersWithPayables = await this.supplierLedgerRepository
            .createQueryBuilder('ledger')
            .select('ledger.supplierId', 'supplier_id')
            .addSelect('MAX(ledger.runningBalance)', 'balance')
            .where('ledger.runningBalance > 0')
            .groupBy('ledger.supplierId')
            .getRawMany();
        console.log(`📊 [SuppliersService] Found ${suppliersWithPayables.length} suppliers with outstanding payables`);
        const items = [];
        const totals = {
            current: 0,
            days31_60: 0,
            days61_90: 0,
            days91_120: 0,
            days120_plus: 0,
            total: 0,
        };
        for (const supplierPayable of suppliersWithPayables) {
            const supplierId = supplierPayable.supplier_id;
            const supplier = await this.supplierRepository.findOne({ where: { id: supplierId } });
            if (!supplier)
                continue;
            const creditTransactions = await this.supplierLedgerRepository.find({
                where: { supplierId, credit: (0, typeorm_2.MoreThan)(0) },
                order: { date: 'ASC' },
            });
            let current = 0;
            let days31_60 = 0;
            let days61_90 = 0;
            let days91_120 = 0;
            let days120_plus = 0;
            const latestLedger = await this.supplierLedgerRepository.findOne({
                where: { supplierId },
                order: { date: 'DESC', createdAt: 'DESC' },
            });
            const totalPayable = latestLedger ? Number(latestLedger.runningBalance) : 0;
            if (totalPayable > 0) {
                const mostRecentCredit = creditTransactions[creditTransactions.length - 1];
                if (mostRecentCredit) {
                    const transactionDate = new Date(mostRecentCredit.date);
                    transactionDate.setHours(0, 0, 0, 0);
                    const daysDiff = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysDiff <= 30) {
                        current = totalPayable;
                    }
                    else if (daysDiff <= 60) {
                        days31_60 = totalPayable;
                    }
                    else if (daysDiff <= 90) {
                        days61_90 = totalPayable;
                    }
                    else if (daysDiff <= 120) {
                        days91_120 = totalPayable;
                    }
                    else {
                        days120_plus = totalPayable;
                    }
                }
                else {
                    current = totalPayable;
                }
            }
            if (totalPayable > 0) {
                items.push({
                    supplier_id: supplierId,
                    supplier_code: supplier.supplier_code,
                    company_name: supplier.company_name,
                    current,
                    days31_60,
                    days61_90,
                    days91_120,
                    days120_plus,
                    total: totalPayable,
                });
                totals.current += current;
                totals.days31_60 += days31_60;
                totals.days61_90 += days61_90;
                totals.days91_120 += days91_120;
                totals.days120_plus += days120_plus;
                totals.total += totalPayable;
            }
        }
        items.sort((a, b) => b.total - a.total);
        console.log(`📊 [SuppliersService] Aging analysis complete: ${items.length} suppliers, Total: ${totals.total}`);
        return { items, totals };
    }
    async getSupplierInvoicesByAging(supplierId, agingPeriod) {
        console.log(`📊 [SuppliersService] Getting invoices for supplier ${supplierId}, aging period: ${agingPeriod}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const allCreditTransactions = await this.supplierLedgerRepository.find({
            where: {
                supplierId,
                credit: (0, typeorm_2.MoreThan)(0),
            },
            order: { date: 'DESC' },
        });
        const filteredInvoices = allCreditTransactions.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            invoiceDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
            switch (agingPeriod) {
                case 'current':
                    return daysDiff <= 30;
                case 'days31_60':
                    return daysDiff > 30 && daysDiff <= 60;
                case 'days61_90':
                    return daysDiff > 60 && daysDiff <= 90;
                case 'days91_120':
                    return daysDiff > 90 && daysDiff <= 120;
                case 'days120_plus':
                    return daysDiff > 120;
                default:
                    return false;
            }
        });
        console.log(`📊 [SuppliersService] Found ${filteredInvoices.length} invoices for aging period ${agingPeriod}`);
        return filteredInvoices;
    }
    async getLedger(supplierId) {
        return this.supplierLedgerRepository.find({
            where: { supplierId },
            order: { id: 'DESC' },
        });
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(1, (0, typeorm_1.InjectRepository)(supplier_ledger_entity_1.SupplierLedger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map