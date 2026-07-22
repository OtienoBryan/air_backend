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
exports.LuggageController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const luggage_service_1 = require("./luggage.service");
const luggage_excess_charge_entity_1 = require("../entities/luggage-excess-charge.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_luggage_dto_1 = require("./dto/create-luggage.dto");
const update_luggage_dto_1 = require("./dto/update-luggage.dto");
const EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID = 54;
let LuggageController = class LuggageController {
    luggageService;
    excessChargeRepository;
    journalEntryRepository;
    journalEntryLineRepository;
    chartOfAccountRepository;
    dataSource;
    constructor(luggageService, excessChargeRepository, journalEntryRepository, journalEntryLineRepository, chartOfAccountRepository, dataSource) {
        this.luggageService = luggageService;
        this.excessChargeRepository = excessChargeRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.dataSource = dataSource;
    }
    async create(createLuggageDto) {
        console.log('🧳 [LuggageController] POST /admin/luggage');
        return this.luggageService.create(createLuggageDto);
    }
    async findAllWithDetails(flightSeriesId, flightIdParam) {
        const seriesId = flightSeriesId ? parseInt(flightSeriesId, 10) : undefined;
        if (flightSeriesId && isNaN(seriesId)) {
            throw new Error('flightSeriesId must be a valid number');
        }
        const flightId = flightIdParam ? parseInt(flightIdParam, 10) : undefined;
        if (flightIdParam && isNaN(flightId)) {
            throw new Error('flightId must be a valid number');
        }
        console.log(`🧳 [LuggageController] GET /admin/luggage/all${seriesId ? `?flightSeriesId=${seriesId}` : ''}${flightId ? `&flightId=${flightId}` : ''}`);
        return this.luggageService.findAllWithDetails(seriesId, flightId);
    }
    async findAllByPassenger(passengerId) {
        console.log(`🧳 [LuggageController] GET /admin/luggage/passenger/${passengerId}`);
        return this.luggageService.findAllByPassenger(passengerId);
    }
    async findOne(id) {
        console.log(`🧳 [LuggageController] GET /admin/luggage/${id}`);
        return this.luggageService.findOne(id);
    }
    async update(id, updateLuggageDto, req) {
        console.log(`🧳 [LuggageController] PUT /admin/luggage/${id}`);
        const updatedBy = req.user?.sub ? Number(req.user.sub) : null;
        return this.luggageService.update(id, updateLuggageDto, updatedBy);
    }
    async remove(id) {
        console.log(`🧳 [LuggageController] DELETE /admin/luggage/${id}`);
        await this.luggageService.remove(id);
        return { message: 'Luggage deleted successfully' };
    }
    async removeAllByPassenger(passengerId) {
        console.log(`🧳 [LuggageController] DELETE /admin/luggage/passenger/${passengerId}`);
        await this.luggageService.removeAllByPassenger(passengerId);
        return { message: 'All luggage deleted successfully' };
    }
    async postExcessCharge(body, req) {
        await this.excessChargeRepository.delete({
            passenger_id: body.passenger_id,
            flight_id: body.flight_id ?? undefined,
        });
        const record = this.excessChargeRepository.create({
            passenger_id: body.passenger_id,
            booking_id: body.booking_id ?? null,
            flight_id: body.flight_id ?? null,
            flight_series_id: body.flight_series_id ?? null,
            route_id: body.route_id ?? null,
            total_weight: body.total_weight,
            weight_limit: body.weight_limit,
            excess_kg: body.excess_kg,
            charge_per_kg: body.charge_per_kg,
            total_charge: body.total_charge,
            currency: body.currency ?? 'USD',
            payment_method: body.payment_method ?? 'cash',
            payment_status: body.payment_status ?? 'pending',
            notes: body.notes ?? null,
        });
        const saved = await this.excessChargeRepository.save(record);
        if (saved.payment_status === 'paid' && Number(saved.total_charge) > 0 && body.payment_account_id) {
            try {
                await this.postJournalEntryForExcessCharge(saved, body.payment_account_id, req.user?.sub ? Number(req.user.sub) : null);
            }
            catch (err) {
                console.error('❌ [LuggageController] Failed to post journal entry for excess charge:', err);
            }
        }
        return saved;
    }
    async generateEntryNumber() {
        const today = new Date();
        const datePrefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const latestEntry = await this.journalEntryRepository.findOne({
            where: { entry_number: (0, typeorm_2.Like)(`JE-${datePrefix}-%`) },
            order: { entry_number: 'DESC' },
        });
        let sequence = 1;
        if (latestEntry) {
            const parts = latestEntry.entry_number.split('-');
            if (parts.length === 3)
                sequence = (parseInt(parts[2] || '0', 10) || 0) + 1;
        }
        return `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
    }
    async postJournalEntryForExcessCharge(charge, paymentAccountId, createdBy) {
        const paymentAccount = await this.chartOfAccountRepository.findOne({ where: { id: paymentAccountId } });
        if (!paymentAccount) {
            console.warn(`⚠️ [LuggageController] Payment account ${paymentAccountId} not found — skipping journal entry`);
            return;
        }
        const revenueAccount = await this.chartOfAccountRepository.findOne({ where: { id: EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID } });
        if (!revenueAccount) {
            console.warn(`⚠️ [LuggageController] Excess-baggage revenue account ${EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID} not found — skipping journal entry`);
            return;
        }
        const amount = Number(charge.total_charge);
        const entryNumber = await this.generateEntryNumber();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const journalEntry = queryRunner.manager.create(journal_entry_entity_1.JournalEntry, {
                entry_number: entryNumber,
                entry_date: new Date(),
                reference: charge.notes ?? `Excess baggage — passenger ${charge.passenger_id}`,
                description: `Excess baggage charge — ${charge.excess_kg}kg over limit, passenger ${charge.passenger_id}${charge.flight_id ? `, flight ${charge.flight_id}` : ''}`,
                total_debit: amount,
                total_credit: amount,
                status: 'posted',
                created_by: createdBy ?? 1,
            });
            const savedEntry = await queryRunner.manager.save(journal_entry_entity_1.JournalEntry, journalEntry);
            const debitLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                journal_entry_id: savedEntry.id,
                account_id: paymentAccount.id,
                debit_amount: amount,
                credit_amount: 0,
                description: `Excess baggage payment received via ${paymentAccount.name}`,
            });
            const creditLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                journal_entry_id: savedEntry.id,
                account_id: revenueAccount.id,
                debit_amount: 0,
                credit_amount: amount,
                description: `Excess baggage revenue — ${charge.excess_kg}kg over limit`,
            });
            await queryRunner.manager.save(journal_entry_line_entity_1.JournalEntryLine, [debitLine, creditLine]);
            await queryRunner.commitTransaction();
            console.log(`✅ [LuggageController] Journal entry ${entryNumber} posted for excess baggage charge (passenger ${charge.passenger_id}, amount ${amount})`);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getExcessCharges(flightId, passengerId) {
        const where = {};
        if (flightId)
            where.flight_id = parseInt(flightId, 10);
        if (passengerId)
            where.passenger_id = parseInt(passengerId, 10);
        return this.excessChargeRepository.find({
            where,
            relations: ['passenger'],
            order: { created_at: 'DESC' },
        });
    }
    async deleteExcessCharge(id) {
        await this.excessChargeRepository.delete(id);
        return { message: 'Deleted' };
    }
};
exports.LuggageController = LuggageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_luggage_dto_1.CreateLuggageDto]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('flightSeriesId')),
    __param(1, (0, common_1.Query)('flightId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "findAllWithDetails", null);
__decorate([
    (0, common_1.Get)('passenger/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "findAllByPassenger", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_luggage_dto_1.UpdateLuggageDto, Object]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('passenger/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "removeAllByPassenger", null);
__decorate([
    (0, common_1.Post)('excess-charges'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "postExcessCharge", null);
__decorate([
    (0, common_1.Get)('excess-charges'),
    __param(0, (0, common_1.Query)('flightId')),
    __param(1, (0, common_1.Query)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "getExcessCharges", null);
__decorate([
    (0, common_1.Delete)('excess-charges/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LuggageController.prototype, "deleteExcessCharge", null);
exports.LuggageController = LuggageController = __decorate([
    (0, common_1.Controller)('admin/luggage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(luggage_excess_charge_entity_1.LuggageExcessCharge)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(3, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(4, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [luggage_service_1.LuggageService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LuggageController);
//# sourceMappingURL=luggage.controller.js.map