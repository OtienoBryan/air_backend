import { Repository } from 'typeorm';
import { Notice } from '../entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticesService {
    private noticeRepository;
    private cache;
    private readonly CACHE_TTL;
    constructor(noticeRepository: Repository<Notice>);
    private getFromCache;
    private setCache;
    private invalidateCache;
    create(createNoticeDto: CreateNoticeDto): Promise<Notice>;
    findAll(countryId?: number, status?: number, limit?: number, offset?: number): Promise<Notice[]>;
    findOne(id: number): Promise<Notice | null>;
    update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<Notice>;
    remove(id: number): Promise<void>;
    toggleStatus(id: number): Promise<Notice>;
    getActiveNotices(countryId?: number, limit?: number): Promise<Notice[]>;
    getNoticeStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
