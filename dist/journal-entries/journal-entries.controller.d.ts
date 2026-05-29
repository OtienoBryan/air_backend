import { JournalEntriesService } from './journal-entries.service';
export declare class JournalEntriesController {
    private readonly journalEntriesService;
    constructor(journalEntriesService: JournalEntriesService);
    findAll(page?: number, limit?: number, startDate?: string, endDate?: string, accountId?: string, reference?: string, description?: string): Promise<{
        entries: any[];
        total: number;
    }>;
}
