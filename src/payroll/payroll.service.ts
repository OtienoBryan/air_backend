import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Payroll } from '../entities/payroll.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Staff } from '../entities/staff.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ payroll: Payroll[], total: number }> {
    console.log('💼 [PayrollService] Finding all payroll records');
    console.log(`💼 [PayrollService] Page: ${page}, Limit: ${limit}`);
    
    const [payroll, total] = await this.payrollRepository.findAndCount({
      relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'staff'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [PayrollService] Found ${payroll.length} payroll records out of ${total} total`);
    return { payroll, total };
  }

  async findOne(id: number): Promise<Payroll> {
    console.log(`💼 [PayrollService] Finding payroll by ID: ${id}`);
    
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'staff'],
    });
    
    if (!payroll) {
      console.log(`❌ [PayrollService] Payroll with ID ${id} not found`);
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }
    
    console.log(`✅ [PayrollService] Payroll found: ID ${payroll.id}, Journal Entry: ${payroll.journal_entry?.entry_number || 'N/A'}`);
    return payroll;
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    console.log(`📝 [PayrollService] Generating entry number for date: ${datePrefix}`);
    
    // Find the latest entry number for today
    const latestEntry = await this.journalEntryRepository.findOne({
      where: {
        entry_number: Like(`JE-${datePrefix}-%`),
      },
      order: { entry_number: 'DESC' },
    });
    
    let sequence = 1;
    if (latestEntry) {
      console.log(`📝 [PayrollService] Found latest entry: ${latestEntry.entry_number}`);
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2] || '0');
        sequence = lastSequence + 1;
        console.log(`📝 [PayrollService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
      }
    } else {
      console.log(`📝 [PayrollService] No previous entries found for today, starting with sequence 1`);
    }
    
    const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
    console.log(`📝 [PayrollService] Generated entry number: ${entryNumber}`);
    return entryNumber;
  }

  async create(createPayrollDto: CreatePayrollDto, createdBy: number | null = null): Promise<Payroll> {
    console.log('💼 [PayrollService] ==========================================');
    console.log('💼 [PayrollService] Creating new payroll record');
    console.log('💼 [PayrollService] Payroll data:', JSON.stringify(createPayrollDto, null, 2));
    console.log('💼 [PayrollService] Created by user ID:', createdBy);
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify that the payroll account exists (typically account_type for salary/payroll expenses)
      console.log(`💼 [PayrollService] Looking up payroll account ID: ${createPayrollDto.payroll_account_id}`);
      const payrollAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { id: createPayrollDto.payroll_account_id },
      });
      
      if (!payrollAccount) {
        console.log(`❌ [PayrollService] Payroll account with ID ${createPayrollDto.payroll_account_id} not found`);
        throw new NotFoundException(`Payroll account with ID ${createPayrollDto.payroll_account_id} not found`);
      }
      console.log(`✅ [PayrollService] Payroll account found: ${payrollAccount.name} (${payrollAccount.code})`);
      
      // Verify staff member exists
      console.log(`💼 [PayrollService] Looking up staff ID: ${createPayrollDto.staff_id}`);
      const staff = await queryRunner.manager.findOne(Staff, {
        where: { id: createPayrollDto.staff_id },
      });
      
      if (!staff) {
        console.log(`❌ [PayrollService] Staff with ID ${createPayrollDto.staff_id} not found`);
        throw new NotFoundException(`Staff with ID ${createPayrollDto.staff_id} not found`);
      }
      console.log(`✅ [PayrollService] Staff found: ${staff.name} (${staff.empl_no})`);
      
      // Create journal entry first
      console.log('💼 [PayrollService] Creating journal entry...');
      const journalEntry = await this.createJournalEntryWithTransaction(createPayrollDto, createdBy, payrollAccount, queryRunner);
      console.log(`✅ [PayrollService] Journal entry created: ${journalEntry.entry_number} (ID: ${journalEntry.id})`);
      
      // Create payroll record
      console.log('💼 [PayrollService] Creating payroll record...');
      const payroll = queryRunner.manager.create(Payroll, {
        journal_entry_id: journalEntry.id,
        staff_id: createPayrollDto.staff_id,
        payroll_date: new Date(createPayrollDto.payroll_date),
        amount: createPayrollDto.amount,
        description: createPayrollDto.description,
        reference: createPayrollDto.reference,
      });
      
      const savedPayroll = await queryRunner.manager.save(Payroll, payroll);
      console.log(`✅ [PayrollService] Payroll created with ID: ${savedPayroll.id}`);
      console.log(`✅ [PayrollService] Payroll references journal entry: ${journalEntry.entry_number}`);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      console.log('✅ [PayrollService] Transaction committed successfully');
      console.log('💼 [PayrollService] ==========================================');
      
      // Return the payroll with relations loaded
      return this.findOne(savedPayroll.id);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      console.error('❌ [PayrollService] Transaction rolled back due to error:', error);
      console.log('💼 [PayrollService] ==========================================');
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  private async createJournalEntryWithTransaction(
    createPayrollDto: CreatePayrollDto, 
    createdBy: number | null,
    payrollAccount: ChartOfAccount,
    queryRunner: any
  ): Promise<JournalEntry> {
    console.log('📝 [PayrollService] ==========================================');
    console.log('📝 [PayrollService] Creating journal entry for payroll');
    console.log('📝 [PayrollService] Payroll account:', payrollAccount.name, `(${payrollAccount.code})`);
    console.log('📝 [PayrollService] Amount:', createPayrollDto.amount);
    console.log('📝 [PayrollService] Is paid:', createPayrollDto.is_paid);
    console.log('📝 [PayrollService] Payment method:', createPayrollDto.payment_method || 'N/A');
    
    // Generate entry number
    console.log('📝 [PayrollService] Generating entry number...');
    const entryNumber = await this.generateEntryNumber();
    console.log(`📝 [PayrollService] Generated entry number: ${entryNumber}`);
    
    // Get credit account
    let creditAccount: ChartOfAccount | null = null;
    
    if (createPayrollDto.is_paid) {
      if (!createPayrollDto.payment_method) {
        console.log(`❌ [PayrollService] Payment method is required when payroll is marked as paid`);
        throw new NotFoundException(`Payment method is required when payroll is marked as paid`);
      }
      
      console.log(`📝 [PayrollService] Looking up payment method account: code=${createPayrollDto.payment_method}, type=9`);
      // Find payment method account by account_code
      creditAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { code: createPayrollDto.payment_method, account_type: 9 },
      });
      
      if (!creditAccount) {
        console.log(`❌ [PayrollService] Payment method account with code ${createPayrollDto.payment_method} not found`);
        throw new NotFoundException(`Payment method account with code ${createPayrollDto.payment_method} not found`);
      }
      console.log(`✅ [PayrollService] Payment method account found: ${creditAccount.name} (${creditAccount.code})`);
    } else {
      console.log('📝 [PayrollService] Payroll not paid, looking up accounts payable account (type=10)...');
      // If not paid, find accounts payable account
      creditAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { account_type: 10 },
      });
      
      if (!creditAccount) {
        console.log(`❌ [PayrollService] Accounts payable account not found. Please ensure an accounts payable account exists in chart_of_accounts`);
        throw new NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
      }
      console.log(`✅ [PayrollService] Accounts payable account found: ${creditAccount.name} (${creditAccount.code})`);
    }
    
    // Create journal entry
    console.log('📝 [PayrollService] Creating journal entry record...');
    const journalEntry = queryRunner.manager.create(JournalEntry, {
      entry_number: entryNumber,
      entry_date: new Date(createPayrollDto.payroll_date),
      reference: createPayrollDto.reference,
      description: createPayrollDto.description || `Payroll: ${payrollAccount.name}`,
      total_debit: createPayrollDto.amount,
      total_credit: createPayrollDto.amount,
      status: 'posted',
      created_by: createdBy || 1,
    });
    
    console.log('📝 [PayrollService] Journal entry data:', {
      entry_number: journalEntry.entry_number,
      entry_date: journalEntry.entry_date,
      reference: journalEntry.reference,
      total_debit: journalEntry.total_debit,
      total_credit: journalEntry.total_credit,
      status: journalEntry.status,
      created_by: journalEntry.created_by
    });
    
    const savedJournalEntry = await queryRunner.manager.save(JournalEntry, journalEntry);
    console.log(`✅ [PayrollService] Journal entry saved with ID: ${savedJournalEntry.id}`);
    
    // Create journal entry lines
    console.log('📝 [PayrollService] Creating journal entry lines...');
    
    // Debit line: Payroll account
    console.log(`📝 [PayrollService] Creating debit line: Account ${payrollAccount.name}, Amount: ${createPayrollDto.amount}`);
    const debitLine = queryRunner.manager.create(JournalEntryLine, {
      journal_entry_id: savedJournalEntry.id,
      account_id: createPayrollDto.payroll_account_id,
      debit_amount: createPayrollDto.amount,
      credit_amount: 0,
      description: createPayrollDto.description || `Payroll: ${payrollAccount.name}`,
    });
    
    // Credit line: Payment method account or accounts payable
    console.log(`📝 [PayrollService] Creating credit line: Account ${creditAccount.name}, Amount: ${createPayrollDto.amount}`);
    const creditLine = queryRunner.manager.create(JournalEntryLine, {
      journal_entry_id: savedJournalEntry.id,
      account_id: creditAccount.id,
      debit_amount: 0,
      credit_amount: createPayrollDto.amount,
      description: createPayrollDto.is_paid 
        ? `Payment via ${creditAccount.name}` 
        : `Accounts Payable: ${createPayrollDto.description || 'Payroll'}`,
    });
    
    const savedLines = await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);
    console.log(`✅ [PayrollService] Journal entry lines created:`);
    console.log(`   - Debit line ID: ${savedLines[0].id}, Account: ${payrollAccount.name}, Amount: ${savedLines[0].debit_amount}`);
    console.log(`   - Credit line ID: ${savedLines[1].id}, Account: ${creditAccount.name}, Amount: ${savedLines[1].credit_amount}`);
    console.log(`✅ [PayrollService] Journal entry ${savedJournalEntry.entry_number} completed successfully`);
    console.log('📝 [PayrollService] ==========================================');
    
    return savedJournalEntry;
  }
}
