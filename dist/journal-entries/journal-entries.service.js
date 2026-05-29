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
exports.JournalEntriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
let JournalEntriesService = class JournalEntriesService {
    journalEntryRepository;
    journalEntryLineRepository;
    constructor(journalEntryRepository, journalEntryLineRepository) {
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
    }
    async findAll(page = 1, limit = 15, startDate, endDate, accountId, reference, description) {
        console.log('📝 [JournalEntriesService] Finding all journal entries');
        console.log('📝 [JournalEntriesService] Filters:', { page, limit, startDate, endDate, accountId, reference, description });
        const queryBuilder = this.journalEntryLineRepository
            .createQueryBuilder('line')
            .innerJoinAndSelect('line.journal_entry', 'entry')
            .innerJoinAndSelect('line.account', 'account')
            .select([
            'entry.id',
            'entry.entry_number',
            'entry.entry_date',
            'entry.reference',
            'entry.description',
            'entry.status',
            'entry.total_debit',
            'entry.total_credit',
            'line.id',
            'line.debit_amount',
            'line.credit_amount',
            'line.description',
            'account.id',
            'account.code',
            'account.name',
        ])
            .orderBy('entry.entry_date', 'DESC')
            .addOrderBy('entry.id', 'DESC')
            .addOrderBy('line.id', 'ASC');
        if (startDate) {
            queryBuilder.andWhere('entry.entry_date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('entry.entry_date <= :endDate', { endDate });
        }
        if (accountId) {
            queryBuilder.andWhere('line.account_id = :accountId', { accountId });
        }
        if (reference) {
            queryBuilder.andWhere('entry.reference LIKE :reference', { reference: `%${reference}%` });
        }
        if (description) {
            queryBuilder.andWhere('(entry.description LIKE :description OR line.description LIKE :description)', { description: `%${description}%` });
        }
        const total = await queryBuilder.getCount();
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const lines = await queryBuilder.getMany();
        const entries = lines
            .filter((line) => line.journal_entry && line.account)
            .map((line) => ({
            id: line.id,
            entry_id: line.journal_entry.id,
            date: line.journal_entry.entry_date,
            entry_number: line.journal_entry.entry_number,
            reference: line.journal_entry.reference,
            account_code: line.account.code,
            account_name: line.account.name,
            account_id: line.account.id,
            description: line.description || line.journal_entry.description || '',
            debit: parseFloat(line.debit_amount.toString()) || 0,
            credit: parseFloat(line.credit_amount.toString()) || 0,
            status: line.journal_entry.status,
        }));
        console.log(`✅ [JournalEntriesService] Found ${entries.length} journal entry lines out of ${total} total`);
        return { entries, total };
    }
};
exports.JournalEntriesService = JournalEntriesService;
exports.JournalEntriesService = JournalEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], JournalEntriesService);
//# sourceMappingURL=journal-entries.service.js.map