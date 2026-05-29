import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 15,
    startDate?: string,
    endDate?: string,
    accountId?: number,
    reference?: string,
    description?: string,
  ): Promise<{ entries: any[], total: number }> {
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

    // Apply filters
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
      queryBuilder.andWhere(
        '(entry.description LIKE :description OR line.description LIKE :description)',
        { description: `%${description}%` }
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const lines = await queryBuilder.getMany();

    // Transform to flat structure (one row per line)
    // Filter out any lines where relations are missing (shouldn't happen with innerJoin, but TypeScript safety)
    const entries = lines
      .filter((line) => line.journal_entry && line.account)
      .map((line) => ({
        id: line.id,
        entry_id: line.journal_entry!.id,
        date: line.journal_entry!.entry_date,
        entry_number: line.journal_entry!.entry_number,
        reference: line.journal_entry!.reference,
        account_code: line.account!.code,
        account_name: line.account!.name,
        account_id: line.account!.id,
        description: line.description || line.journal_entry!.description || '',
        debit: parseFloat(line.debit_amount.toString()) || 0,
        credit: parseFloat(line.credit_amount.toString()) || 0,
        status: line.journal_entry!.status,
      }));

    console.log(`✅ [JournalEntriesService] Found ${entries.length} journal entry lines out of ${total} total`);
    return { entries, total };
  }
}
