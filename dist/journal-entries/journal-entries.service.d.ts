import { Repository } from 'typeorm';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
export declare class JournalEntriesService {
    private journalEntryRepository;
    private journalEntryLineRepository;
    constructor(journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>);
    findAll(page?: number, limit?: number, startDate?: string, endDate?: string, accountId?: number, reference?: string, description?: string): Promise<{
        entries: any[];
        total: number;
    }>;
}
