import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  // Simple cache helper methods
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    console.log('🔍 [NoticesService] Creating notice:', createNoticeDto);
    
    const notice = this.noticeRepository.create(createNoticeDto);
    const savedNotice = await this.noticeRepository.save(notice);
    
    // Invalidate notices cache
    this.invalidateCache('notices');
    
    console.log('✅ [NoticesService] Notice created with ID:', savedNotice.id);
    return savedNotice;
  }

  async findAll(countryId?: number, status?: number, limit: number = 50, offset: number = 0): Promise<Notice[]> {
    console.log('🔍 [NoticesService] Finding notices:', { countryId, status, limit, offset });
    
    // Check cache first
    const cacheKey = `notices_${countryId || 'all'}_${status || 'all'}_${limit}_${offset}`;
    const cachedNotices = this.getFromCache<Notice[]>(cacheKey);
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
    
    // Cache for 5 minutes
    this.setCache(cacheKey, notices, 300000);
    
    console.log('📋 [NoticesService] Notices found:', notices.length);
    return notices;
  }

  async findOne(id: number): Promise<Notice | null> {
    console.log('🔍 [NoticesService] Finding notice by ID:', id);
    
    // Check cache first
    const cacheKey = `notice_${id}`;
    const cachedNotice = this.getFromCache<Notice>(cacheKey);
    if (cachedNotice) {
      console.log('📋 [NoticesService] Returning cached notice');
      return cachedNotice;
    }

    const notice = await this.noticeRepository.findOne({
      where: { id },
      relations: ['country']
    });

    if (notice) {
      // Cache for 10 minutes
      this.setCache(cacheKey, notice, 600000);
    }
    
    console.log('📋 [NoticesService] Notice found:', notice ? 'Yes' : 'No');
    return notice;
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    console.log('🔍 [NoticesService] Updating notice:', id, updateNoticeDto);
    
    await this.noticeRepository.update(id, updateNoticeDto);
    const updatedNotice = await this.findOne(id);
    
    if (!updatedNotice) {
      throw new Error('Notice not found');
    }
    
    // Invalidate caches
    this.invalidateCache('notices');
    this.invalidateCache(`notice_${id}`);
    
    console.log('✅ [NoticesService] Notice updated successfully');
    return updatedNotice;
  }

  async remove(id: number): Promise<void> {
    console.log('🔍 [NoticesService] Deleting notice:', id);
    
    const result = await this.noticeRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Notice not found');
    }
    
    // Invalidate caches
    this.invalidateCache('notices');
    this.invalidateCache(`notice_${id}`);
    
    console.log('✅ [NoticesService] Notice deleted successfully');
  }

  async toggleStatus(id: number): Promise<Notice> {
    console.log('🔍 [NoticesService] Toggling notice status:', id);
    
    const notice = await this.findOne(id);
    if (!notice) {
      throw new Error('Notice not found');
    }
    
    const newStatus = notice.status === 1 ? 0 : 1;
    return this.update(id, { status: newStatus });
  }

  async getActiveNotices(countryId?: number, limit: number = 10): Promise<Notice[]> {
    console.log('🔍 [NoticesService] Getting active notices:', { countryId, limit });
    
    return this.findAll(countryId, 1, limit);
  }

  async getNoticeStats(): Promise<{ total: number; active: number; inactive: number }> {
    console.log('🔍 [NoticesService] Getting notice statistics');
    
    // Check cache first
    const cacheKey = 'notice_stats';
    const cachedStats = this.getFromCache<{ total: number; active: number; inactive: number }>(cacheKey);
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
    
    // Cache for 2 minutes
    this.setCache(cacheKey, stats, 120000);
    
    console.log('📊 [NoticesService] Stats calculated:', stats);
    return stats;
  }
}
