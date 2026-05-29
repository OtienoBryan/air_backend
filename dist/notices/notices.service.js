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
exports.NoticesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notice_entity_1 = require("../entities/notice.entity");
let NoticesService = class NoticesService {
    noticeRepository;
    cache = new Map();
    CACHE_TTL = 5 * 60 * 1000;
    constructor(noticeRepository) {
        this.noticeRepository = noticeRepository;
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        if (cached) {
            this.cache.delete(key);
        }
        return null;
    }
    setCache(key, data, ttl = this.CACHE_TTL) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        });
    }
    invalidateCache(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
    async create(createNoticeDto) {
        console.log('🔍 [NoticesService] Creating notice:', createNoticeDto);
        const notice = this.noticeRepository.create(createNoticeDto);
        const savedNotice = await this.noticeRepository.save(notice);
        this.invalidateCache('notices');
        console.log('✅ [NoticesService] Notice created with ID:', savedNotice.id);
        return savedNotice;
    }
    async findAll(countryId, status, limit = 50, offset = 0) {
        console.log('🔍 [NoticesService] Finding notices:', { countryId, status, limit, offset });
        const cacheKey = `notices_${countryId || 'all'}_${status || 'all'}_${limit}_${offset}`;
        const cachedNotices = this.getFromCache(cacheKey);
        if (cachedNotices) {
            console.log('📋 [NoticesService] Returning cached notices:', cachedNotices.length);
            return cachedNotices;
        }
        const queryBuilder = this.noticeRepository
            .createQueryBuilder('notice')
            .leftJoinAndSelect('notice.country', 'country')
            .orderBy('notice.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);
        if (countryId) {
            queryBuilder.andWhere('notice.countryId = :countryId', { countryId });
        }
        if (status !== undefined) {
            queryBuilder.andWhere('notice.status = :status', { status });
        }
        const notices = await queryBuilder.getMany();
        this.setCache(cacheKey, notices, 300000);
        console.log('📋 [NoticesService] Notices found:', notices.length);
        return notices;
    }
    async findOne(id) {
        console.log('🔍 [NoticesService] Finding notice by ID:', id);
        const cacheKey = `notice_${id}`;
        const cachedNotice = this.getFromCache(cacheKey);
        if (cachedNotice) {
            console.log('📋 [NoticesService] Returning cached notice');
            return cachedNotice;
        }
        const notice = await this.noticeRepository.findOne({
            where: { id },
            relations: ['country']
        });
        if (notice) {
            this.setCache(cacheKey, notice, 600000);
        }
        console.log('📋 [NoticesService] Notice found:', notice ? 'Yes' : 'No');
        return notice;
    }
    async update(id, updateNoticeDto) {
        console.log('🔍 [NoticesService] Updating notice:', id, updateNoticeDto);
        await this.noticeRepository.update(id, updateNoticeDto);
        const updatedNotice = await this.findOne(id);
        if (!updatedNotice) {
            throw new Error('Notice not found');
        }
        this.invalidateCache('notices');
        this.invalidateCache(`notice_${id}`);
        console.log('✅ [NoticesService] Notice updated successfully');
        return updatedNotice;
    }
    async remove(id) {
        console.log('🔍 [NoticesService] Deleting notice:', id);
        const result = await this.noticeRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Notice not found');
        }
        this.invalidateCache('notices');
        this.invalidateCache(`notice_${id}`);
        console.log('✅ [NoticesService] Notice deleted successfully');
    }
    async toggleStatus(id) {
        console.log('🔍 [NoticesService] Toggling notice status:', id);
        const notice = await this.findOne(id);
        if (!notice) {
            throw new Error('Notice not found');
        }
        const newStatus = notice.status === 1 ? 0 : 1;
        return this.update(id, { status: newStatus });
    }
    async getActiveNotices(countryId, limit = 10) {
        console.log('🔍 [NoticesService] Getting active notices:', { countryId, limit });
        return this.findAll(countryId, 1, limit);
    }
    async getNoticeStats() {
        console.log('🔍 [NoticesService] Getting notice statistics');
        const cacheKey = 'notice_stats';
        const cachedStats = this.getFromCache(cacheKey);
        if (cachedStats) {
            console.log('📊 [NoticesService] Returning cached stats');
            return cachedStats;
        }
        const [total, active, inactive] = await Promise.all([
            this.noticeRepository.count(),
            this.noticeRepository.count({ where: { status: 1 } }),
            this.noticeRepository.count({ where: { status: 0 } })
        ]);
        const stats = { total, active, inactive };
        this.setCache(cacheKey, stats, 120000);
        console.log('📊 [NoticesService] Stats calculated:', stats);
        return stats;
    }
};
exports.NoticesService = NoticesService;
exports.NoticesService = NoticesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notice_entity_1.Notice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NoticesService);
//# sourceMappingURL=notices.service.js.map