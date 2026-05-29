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
exports.SalesRepAttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const login_history_entity_1 = require("../entities/login-history.entity");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
let SalesRepAttendanceService = class SalesRepAttendanceService {
    loginHistoryRepository;
    salesRepRepository;
    constructor(loginHistoryRepository, salesRepRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.salesRepRepository = salesRepRepository;
    }
    async getAttendanceRecords(salesRepId, startDate, endDate, status, limit = 50, offset = 0) {
        try {
            console.log('📊 [SalesRepAttendanceService] Fetching attendance records...', {
                salesRepId,
                startDate,
                endDate,
                status,
                limit,
                offset
            });
            let query = this.loginHistoryRepository
                .createQueryBuilder('lh')
                .leftJoinAndSelect('lh.salesRep', 'sr')
                .select([
                'lh.id',
                'lh.userId',
                'lh.timezone',
                'lh.duration',
                'lh.status',
                'lh.sessionStart',
                'lh.sessionEnd',
                'sr.name',
                'sr.email',
                'sr.country',
                'sr.region',
                'sr.route'
            ]);
            if (salesRepId) {
                query = query.andWhere('lh.userId = :salesRepId', { salesRepId });
            }
            if (startDate) {
                query = query.andWhere('DATE(lh.sessionStart) >= :startDate', { startDate });
                console.log('📊 [SalesRepAttendanceService] Added startDate filter:', startDate);
            }
            if (endDate) {
                query = query.andWhere('DATE(lh.sessionStart) <= :endDate', { endDate });
                console.log('📊 [SalesRepAttendanceService] Added endDate filter:', endDate);
            }
            if (status !== undefined) {
                query = query.andWhere('lh.status = :status', { status });
            }
            query = query.orderBy('lh.sessionStart', 'DESC');
            query = query.limit(limit).offset(offset);
            console.log('📊 [SalesRepAttendanceService] Generated SQL query:', query.getSql());
            console.log('📊 [SalesRepAttendanceService] Query parameters:', query.getParameters());
            const records = await query.getMany();
            console.log('📊 [SalesRepAttendanceService] Records found:', records.length);
            console.log('📊 [SalesRepAttendanceService] Raw records:', records);
            const mappedRecords = records.map(record => ({
                id: record.id,
                userId: record.userId,
                salesRepName: record.salesRep?.name || 'Unknown',
                salesRepEmail: record.salesRep?.email || 'Unknown',
                timezone: record.timezone,
                duration: record.duration,
                status: record.status,
                sessionStart: record.sessionStart,
                sessionEnd: record.sessionEnd,
                country: record.salesRep?.country || 'Unknown',
                region: record.salesRep?.region || 'Unknown',
                route: record.salesRep?.route || 'Unknown'
            }));
            console.log('📊 [SalesRepAttendanceService] Mapped records:', mappedRecords.map(r => ({
                id: r.id,
                sessionStart: r.sessionStart,
                sessionEnd: r.sessionEnd,
                duration: r.duration
            })));
            return mappedRecords;
        }
        catch (error) {
            console.error('❌ [SalesRepAttendanceService] Error fetching attendance records:', error);
            throw error;
        }
    }
    async getAttendanceStats(startDate, endDate) {
        try {
            console.log('📊 [SalesRepAttendanceService] Fetching attendance stats...', {
                startDate,
                endDate
            });
            let query = this.loginHistoryRepository.createQueryBuilder('lh');
            if (startDate) {
                query = query.andWhere('DATE(lh.sessionStart) >= :startDate', { startDate });
                console.log('📊 [SalesRepAttendanceService] Stats - Added startDate filter:', startDate);
            }
            if (endDate) {
                query = query.andWhere('DATE(lh.sessionStart) <= :endDate', { endDate });
                console.log('📊 [SalesRepAttendanceService] Stats - Added endDate filter:', endDate);
            }
            const records = await query.getMany();
            const totalSessions = records.length;
            const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
            const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
            const uniqueUserIds = new Set(records.map(record => record.userId).filter(id => id !== null));
            const activeSalesReps = uniqueUserIds.size;
            const byStatus = records.reduce((acc, record) => {
                acc[record.status] = (acc[record.status] || 0) + 1;
                return acc;
            }, {});
            const salesRepIds = Array.from(uniqueUserIds);
            const salesReps = await this.salesRepRepository.findByIds(salesRepIds);
            const byCountry = salesReps.reduce((acc, rep) => {
                acc[rep.country] = (acc[rep.country] || 0) + 1;
                return acc;
            }, {});
            const byRegion = salesReps.reduce((acc, rep) => {
                acc[rep.region] = (acc[rep.region] || 0) + 1;
                return acc;
            }, {});
            const stats = {
                totalSessions,
                totalDuration,
                averageSessionDuration: Math.round(averageSessionDuration),
                activeSalesReps,
                byStatus,
                byCountry,
                byRegion
            };
            console.log('📊 [SalesRepAttendanceService] Stats calculated:', stats);
            return stats;
        }
        catch (error) {
            console.error('❌ [SalesRepAttendanceService] Error fetching attendance stats:', error);
            throw error;
        }
    }
    async getSalesReps() {
        try {
            console.log('👥 [SalesRepAttendanceService] Fetching sales reps...');
            const salesReps = await this.salesRepRepository.find({
                select: ['id', 'name', 'email', 'country', 'region', 'route', 'status'],
                where: { status: 1 }
            });
            console.log('👥 [SalesRepAttendanceService] Sales reps found:', salesReps.length);
            return salesReps;
        }
        catch (error) {
            console.error('❌ [SalesRepAttendanceService] Error fetching sales reps:', error);
            throw error;
        }
    }
};
exports.SalesRepAttendanceService = SalesRepAttendanceService;
exports.SalesRepAttendanceService = SalesRepAttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SalesRepAttendanceService);
//# sourceMappingURL=sales-rep-attendance.service.js.map