import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticesController {
    private readonly noticesService;
    constructor(noticesService: NoticesService);
    create(createNoticeDto: CreateNoticeDto): Promise<import("../entities").Notice>;
    findAll(countryId?: number, status?: number, limit?: number, offset?: number): Promise<import("../entities").Notice[]>;
    getActiveNotices(countryId?: number, limit?: number): Promise<import("../entities").Notice[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    findOne(id: number): Promise<import("../entities").Notice | null>;
    update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<import("../entities").Notice>;
    toggleStatus(id: number): Promise<import("../entities").Notice>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
