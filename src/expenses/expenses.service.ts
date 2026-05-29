import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(SupplierLedger)
    private supplierLedgerRepository: Repository<SupplierLedger>,
    private dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ expenses: Expense[], total: number }> {
    console.log('💰 [ExpensesService] Finding all expenses');
    console.log(`💰 [ExpensesService] Page: ${page}, Limit: ${limit}`);
    
    const [expenses, total] = await this.expenseRepository.findAndCount({
      relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'supplier'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [ExpensesService] Found ${expenses.length} expenses out of ${total} total`);
    expenses.forEach((expense, index) => {
      console.log(`   [${index + 1}] Expense ID: ${expense.id}, Journal Entry: ${expense.journal_entry?.entry_number || 'N/A'}`);
    });
    return { expenses, total };
  }

  async findOne(id: number): Promise<Expense> {
    console.log(`💰 [ExpensesService] Finding expense by ID: ${id}`);
    
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['journal_entry', 'journal_entry.lines', 'journal_entry.lines.account', 'supplier'],
    });
    
    if (!expense) {
      console.log(`❌ [ExpensesService] Expense with ID ${id} not found`);
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    
    console.log(`✅ [ExpensesService] Expense found: ID ${expense.id}, Journal Entry: ${expense.journal_entry?.entry_number || 'N/A'}`);
    if (expense.journal_entry) {
      console.log(`   Journal Entry Details:`);
      console.log(`   - Entry Number: ${expense.journal_entry.entry_number}`);
      console.log(`   - Date: ${expense.journal_entry.entry_date}`);
      console.log(`   - Total Debit: ${expense.journal_entry.total_debit}`);
      console.log(`   - Total Credit: ${expense.journal_entry.total_credit}`);
      console.log(`   - Lines: ${expense.journal_entry.lines?.length || 0}`);
    }
    return expense;
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    console.log(`📝 [ExpensesService] Generating entry number for date: ${datePrefix}`);
    
    // Find the latest entry number for today
    const latestEntry = await this.journalEntryRepository.findOne({
      where: {
        entry_number: Like(`JE-${datePrefix}-%`),
      },
      order: { entry_number: 'DESC' },
    });
    
    let sequence = 1;
    if (latestEntry) {
      console.log(`📝 [ExpensesService] Found latest entry: ${latestEntry.entry_number}`);
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2] || '0');
        sequence = lastSequence + 1;
        console.log(`📝 [ExpensesService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
      }
    } else {
      console.log(`📝 [ExpensesService] No previous entries found for today, starting with sequence 1`);
    }
    
    const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
    console.log(`📝 [ExpensesService] Generated entry number: ${entryNumber}`);
    return entryNumber;
  }

  async create(createExpenseDto: CreateExpenseDto, createdBy: number | null = null): Promise<Expense> {
    console.log('💰 [ExpensesService] ==========================================');
    console.log('💰 [ExpensesService] Creating new expense');
    console.log('💰 [ExpensesService] Expense data:', JSON.stringify(createExpenseDto, null, 2));
    console.log('💰 [ExpensesService] Created by user ID:', createdBy);
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify that the expense account exists and has account_type = 16
      console.log(`💰 [ExpensesService] Looking up expense account ID: ${createExpenseDto.expense_account_id}, type: 16`);
      const expenseAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { id: createExpenseDto.expense_account_id, account_type: 16 },
      });
      
      if (!expenseAccount) {
        console.log(`❌ [ExpensesService] Expense account with ID ${createExpenseDto.expense_account_id} not found or not an expense account (type 16)`);
        throw new NotFoundException(`Expense account with ID ${createExpenseDto.expense_account_id} not found or not an expense account`);
      }
      console.log(`✅ [ExpensesService] Expense account found: ${expenseAccount.name} (${expenseAccount.code})`);
      
      // Create journal entry first
      console.log('💰 [ExpensesService] Creating journal entry...');
      const journalEntry = await this.createJournalEntryWithTransaction(createExpenseDto, createdBy, expenseAccount, queryRunner);
      console.log(`✅ [ExpensesService] Journal entry created: ${journalEntry.entry_number} (ID: ${journalEntry.id})`);
      
      // Validate supplier if provided
      let supplier: Supplier | null = null;
      if (createExpenseDto.supplier_id) {
        console.log(`💰 [ExpensesService] Looking up supplier ID: ${createExpenseDto.supplier_id}`);
        supplier = await queryRunner.manager.findOne(Supplier, {
          where: { id: createExpenseDto.supplier_id },
        });
        
        if (!supplier) {
          console.log(`❌ [ExpensesService] Supplier with ID ${createExpenseDto.supplier_id} not found`);
          throw new NotFoundException(`Supplier with ID ${createExpenseDto.supplier_id} not found`);
        }
        console.log(`✅ [ExpensesService] Supplier found: ${supplier.company_name} (${supplier.supplier_code})`);
      }
      
      // Create expense that references the journal entry
      console.log('💰 [ExpensesService] Creating expense record...');
      const totalAmount = createExpenseDto.amount;
      const amountPaid = createExpenseDto.is_paid ? totalAmount : 0;
      const balance = totalAmount - amountPaid;
      
      const expense = queryRunner.manager.create(Expense, {
        journal_entry_id: journalEntry.id,
        supplier_id: createExpenseDto.supplier_id || null,
        amount_paid: amountPaid,
        balance: balance,
      });
      
      const savedExpense = await queryRunner.manager.save(Expense, expense);
      console.log(`✅ [ExpensesService] Expense created with ID: ${savedExpense.id}`);
      console.log(`✅ [ExpensesService] Expense references journal entry: ${journalEntry.entry_number}`);
      console.log(`✅ [ExpensesService] Amount paid: ${amountPaid}, Balance: ${balance}`);
      
      // Create supplier ledger entry if supplier is provided
      if (supplier) {
        console.log(`💰 [ExpensesService] Creating supplier ledger entry for supplier: ${supplier.company_name}`);
        
        // Get current supplier balance (latest running balance)
        const latestLedger = await queryRunner.manager.findOne(SupplierLedger, {
          where: { supplierId: supplier.id },
          order: { date: 'DESC', createdAt: 'DESC' },
        });
        
        const currentSupplierBalance = latestLedger ? Number(latestLedger.runningBalance) : 0;
        const updatedSupplierBalance = currentSupplierBalance + totalAmount;
        
        // Create supplier ledger entry
        const supplierLedgerEntry = queryRunner.manager.create(SupplierLedger, {
          supplierId: supplier.id,
          date: new Date(createExpenseDto.expense_date),
          description: createExpenseDto.description || `Expense - ${journalEntry.entry_number}`,
          debit: 0,
          credit: totalAmount,
          runningBalance: updatedSupplierBalance,
          referenceType: 'EXPENSE',
          referenceId: savedExpense.id,
        });
        
        await queryRunner.manager.save(SupplierLedger, supplierLedgerEntry);
        console.log(`✅ [ExpensesService] Supplier ledger entry created with reference: EXPENSE-${savedExpense.id}`);
        console.log(`✅ [ExpensesService] Supplier balance updated: ${currentSupplierBalance} -> ${updatedSupplierBalance}`);
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      console.log('✅ [ExpensesService] Transaction committed successfully');
      console.log('💰 [ExpensesService] ==========================================');
      
      // Return the expense with relations loaded
      return this.findOne(savedExpense.id);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      console.error('❌ [ExpensesService] Transaction rolled back due to error:', error);
      console.log('💰 [ExpensesService] ==========================================');
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  private async createJournalEntry(
    createExpenseDto: CreateExpenseDto, 
    createdBy: number | null,
    expenseAccount: ChartOfAccount
  ): Promise<JournalEntry> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const journalEntry = await this.createJournalEntryWithTransaction(createExpenseDto, createdBy, expenseAccount, queryRunner);
      await queryRunner.commitTransaction();
      return journalEntry;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createJournalEntryWithTransaction(
    createExpenseDto: CreateExpenseDto, 
    createdBy: number | null,
    expenseAccount: ChartOfAccount,
    queryRunner: any
  ): Promise<JournalEntry> {
    console.log('📝 [ExpensesService] ==========================================');
    console.log('📝 [ExpensesService] Creating journal entry for expense');
    console.log('📝 [ExpensesService] Expense account:', expenseAccount.name, `(${expenseAccount.code})`);
    console.log('📝 [ExpensesService] Amount:', createExpenseDto.amount);
    console.log('📝 [ExpensesService] Is paid:', createExpenseDto.is_paid);
    console.log('📝 [ExpensesService] Payment method:', createExpenseDto.payment_method || 'N/A');
    
    // Generate entry number
    console.log('📝 [ExpensesService] Generating entry number...');
    const entryNumber = await this.generateEntryNumber();
    console.log(`📝 [ExpensesService] Generated entry number: ${entryNumber}`);
    
    // Get credit account
    let creditAccount: ChartOfAccount | null = null;
    
    if (createExpenseDto.is_paid) {
      if (!createExpenseDto.payment_method) {
        console.log(`❌ [ExpensesService] Payment method is required when expense is marked as paid`);
        throw new NotFoundException(`Payment method is required when expense is marked as paid`);
      }
      
      console.log(`📝 [ExpensesService] Looking up payment method account: code=${createExpenseDto.payment_method}, type=9`);
      // Find payment method account by account_code
      creditAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { code: createExpenseDto.payment_method, account_type: 9 },
      });
      
      if (!creditAccount) {
        console.log(`❌ [ExpensesService] Payment method account with code ${createExpenseDto.payment_method} not found`);
        throw new NotFoundException(`Payment method account with code ${createExpenseDto.payment_method} not found`);
      }
      console.log(`✅ [ExpensesService] Payment method account found: ${creditAccount.name} (${creditAccount.code})`);
    } else {
      console.log('📝 [ExpensesService] Expense not paid, looking up accounts payable account (type=10)...');
      // If not paid, find accounts payable account (assuming account_type for payables)
      // You may need to adjust this based on your chart of accounts structure
      creditAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { account_type: 10 }, // Assuming 10 is accounts payable type, adjust as needed
      });
      
      if (!creditAccount) {
        console.log(`❌ [ExpensesService] Accounts payable account not found. Please ensure an accounts payable account exists in chart_of_accounts`);
        throw new NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
      }
      console.log(`✅ [ExpensesService] Accounts payable account found: ${creditAccount.name} (${creditAccount.code})`);
    }
    
    // Create journal entry
    console.log('📝 [ExpensesService] Creating journal entry record...');
    const journalEntry = queryRunner.manager.create(JournalEntry, {
      entry_number: entryNumber,
      entry_date: new Date(createExpenseDto.expense_date),
      reference: createExpenseDto.reference,
      description: createExpenseDto.description || `Expense: ${expenseAccount.name}`,
      total_debit: createExpenseDto.amount,
      total_credit: createExpenseDto.amount,
      status: 'posted',
      created_by: createdBy || 1, // Default to 1 if no user provided
    });
    
    console.log('📝 [ExpensesService] Journal entry data:', {
      entry_number: journalEntry.entry_number,
      entry_date: journalEntry.entry_date,
      reference: journalEntry.reference,
      total_debit: journalEntry.total_debit,
      total_credit: journalEntry.total_credit,
      status: journalEntry.status,
      created_by: journalEntry.created_by
    });
    
    const savedJournalEntry = await queryRunner.manager.save(JournalEntry, journalEntry);
    console.log(`✅ [ExpensesService] Journal entry saved with ID: ${savedJournalEntry.id}`);
    
    // Create journal entry lines
    console.log('📝 [ExpensesService] Creating journal entry lines...');
    
    // Debit line: Expense account
    console.log(`📝 [ExpensesService] Creating debit line: Account ${expenseAccount.name}, Amount: ${createExpenseDto.amount}`);
    const debitLine = queryRunner.manager.create(JournalEntryLine, {
      journal_entry_id: savedJournalEntry.id,
      account_id: createExpenseDto.expense_account_id,
      debit_amount: createExpenseDto.amount,
      credit_amount: 0,
      description: createExpenseDto.description || `Expense: ${expenseAccount.name}`,
    });
    
    // Credit line: Payment method account or accounts payable
    console.log(`📝 [ExpensesService] Creating credit line: Account ${creditAccount.name}, Amount: ${createExpenseDto.amount}`);
    const creditLine = queryRunner.manager.create(JournalEntryLine, {
      journal_entry_id: savedJournalEntry.id,
      account_id: creditAccount.id,
      debit_amount: 0,
      credit_amount: createExpenseDto.amount,
      description: createExpenseDto.is_paid 
        ? `Payment via ${creditAccount.name}` 
        : `Accounts Payable: ${createExpenseDto.description || 'Expense'}`,
    });
    
    const savedLines = await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);
    console.log(`✅ [ExpensesService] Journal entry lines created:`);
    console.log(`   - Debit line ID: ${savedLines[0].id}, Account: ${expenseAccount.name}, Amount: ${savedLines[0].debit_amount}`);
    console.log(`   - Credit line ID: ${savedLines[1].id}, Account: ${creditAccount.name}, Amount: ${savedLines[1].credit_amount}`);
    console.log(`✅ [ExpensesService] Journal entry ${savedJournalEntry.entry_number} completed successfully`);
    console.log('📝 [ExpensesService] ==========================================');
    
    return savedJournalEntry;
  }

  async updatePayment(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    console.log('💰 [ExpensesService] ==========================================');
    console.log('💰 [ExpensesService] Updating payment for expense');
    console.log(`💰 [ExpensesService] Expense ID: ${id}`);
    console.log('💰 [ExpensesService] Update data:', JSON.stringify(updateExpenseDto, null, 2));
    
    // Find the expense with journal entry and lines
    const expense = await this.findOne(id);
    
    if (!expense.journal_entry) {
      console.log(`❌ [ExpensesService] Expense ${id} has no journal entry`);
      throw new NotFoundException(`Expense ${id} has no journal entry`);
    }
    
    const journalEntry = expense.journal_entry;
    const totalAmount = journalEntry.total_debit;
    const currentAmountPaid = Number(expense.amount_paid || 0);
    const currentBalance = Number(expense.balance || totalAmount);
    const paymentAmount = updateExpenseDto.amount;
    
    // Validate payment amount
    if (paymentAmount <= 0) {
      throw new NotFoundException(`Payment amount must be greater than 0`);
    }
    
    if (paymentAmount > currentBalance) {
      throw new NotFoundException(`Payment amount (${paymentAmount}) cannot exceed balance (${currentBalance})`);
    }
    
    // Verify payment method account exists
    if (!updateExpenseDto.payment_method) {
      console.log(`❌ [ExpensesService] Payment method is required`);
      throw new NotFoundException(`Payment method is required`);
    }
    
    console.log(`📝 [ExpensesService] Looking up payment method account: code=${updateExpenseDto.payment_method}, type=9`);
    const paymentMethodAccount = await this.chartOfAccountRepository.findOne({
      where: { code: updateExpenseDto.payment_method, account_type: 9 },
    });
    
    if (!paymentMethodAccount) {
      console.log(`❌ [ExpensesService] Payment method account with code ${updateExpenseDto.payment_method} not found`);
      throw new NotFoundException(`Payment method account with code ${updateExpenseDto.payment_method} not found`);
    }
    console.log(`✅ [ExpensesService] Payment method account found: ${paymentMethodAccount.name} (${paymentMethodAccount.code})`);
    
    // Get accounts payable account (type 10)
    const accountsPayableAccount = await this.chartOfAccountRepository.findOne({
      where: { account_type: 10 },
    });
    
    if (!accountsPayableAccount) {
      console.log(`❌ [ExpensesService] Accounts payable account not found`);
      throw new NotFoundException(`Accounts payable account not found`);
    }
    
    // Create new journal entry for the payment
    console.log(`📝 [ExpensesService] Creating payment journal entry for amount: ${paymentAmount}`);
    const paymentEntryNumber = await this.generateEntryNumber();
    
    const paymentJournalEntry = this.journalEntryRepository.create({
      entry_number: paymentEntryNumber,
      entry_date: new Date(),
      reference: journalEntry.reference,
      description: `Payment for expense: ${journalEntry.description || 'N/A'}`,
      total_debit: paymentAmount,
      total_credit: paymentAmount,
      status: 'posted',
      created_by: 1,
    });
    
    const savedPaymentEntry = await this.journalEntryRepository.save(paymentJournalEntry);
    console.log(`✅ [ExpensesService] Payment journal entry created: ${savedPaymentEntry.entry_number}`);
    
    // Create journal entry lines for the payment
    // Debit: Accounts Payable (reducing the payable)
    const debitLine = this.journalEntryLineRepository.create({
      journal_entry_id: savedPaymentEntry.id,
      account_id: accountsPayableAccount.id,
      debit_amount: paymentAmount,
      credit_amount: 0,
      description: `Payment reducing accounts payable`,
    });
    
    // Credit: Payment Method (the actual payment)
    const creditLine = this.journalEntryLineRepository.create({
      journal_entry_id: savedPaymentEntry.id,
      account_id: paymentMethodAccount.id,
      debit_amount: 0,
      credit_amount: paymentAmount,
      description: `Payment via ${paymentMethodAccount.name}`,
    });
    
    await this.journalEntryLineRepository.save([debitLine, creditLine]);
    console.log(`✅ [ExpensesService] Payment journal entry lines created`);
    
    // Update expense amount_paid and balance
    const newAmountPaid = currentAmountPaid + paymentAmount;
    const newBalance = currentBalance - paymentAmount;
    
    expense.amount_paid = newAmountPaid;
    expense.balance = newBalance;
    
    await this.expenseRepository.save(expense);
    console.log(`✅ [ExpensesService] Expense updated: Amount Paid: ${newAmountPaid}, Balance: ${newBalance}`);
    
    console.log('💰 [ExpensesService] ==========================================');
    return this.findOne(id);
  }

  async getPaymentHistory(id: number): Promise<JournalEntry[]> {
    console.log('💰 [ExpensesService] ==========================================');
    console.log('💰 [ExpensesService] Getting payment history for expense');
    console.log(`💰 [ExpensesService] Expense ID: ${id}`);
    
    // Find the expense with journal entry
    const expense = await this.findOne(id);
    
    if (!expense.journal_entry) {
      console.log(`❌ [ExpensesService] Expense ${id} has no journal entry`);
      throw new NotFoundException(`Expense ${id} has no journal entry`);
    }
    
    const expenseReference = expense.journal_entry.reference;
    const expenseJournalEntryId = expense.journal_entry_id;
    
    console.log(`📝 [ExpensesService] Finding payment journal entries with reference: ${expenseReference}`);
    
    // If no reference, return empty array
    if (!expenseReference) {
      console.log(`⚠️ [ExpensesService] Expense has no reference, returning empty payment history`);
      return [];
    }
    
    // Find all journal entries with the same reference (payments)
    // Exclude the original expense journal entry
    const paymentEntries = await this.journalEntryRepository.find({
      where: { reference: expenseReference },
      relations: ['lines', 'lines.account'],
      order: { entry_date: 'DESC', created_at: 'DESC' },
    });
    
    // Filter out the original expense entry and only include payment entries
    // Payment entries have a credit line with account_type = 9 (payment method)
    const paymentHistory = paymentEntries.filter(entry => {
      // Exclude the original expense entry
      if (entry.id === expenseJournalEntryId) {
        return false;
      }
      
      // Only include entries that have a payment method (account_type = 9) in credit line
      const hasPaymentMethod = entry.lines?.some(line => 
        line.credit_amount > 0 && line.account?.account_type === 9
      );
      
      return hasPaymentMethod;
    });
    
    console.log(`✅ [ExpensesService] Found ${paymentHistory.length} payment entries`);
    paymentHistory.forEach((entry, index) => {
      const paymentLine = entry.lines?.find(line => line.credit_amount > 0 && line.account?.account_type === 9);
      console.log(`   [${index + 1}] Entry: ${entry.entry_number}, Amount: ${entry.total_credit}, Payment Method: ${paymentLine?.account?.name || 'N/A'}, Date: ${entry.entry_date}`);
    });
    
    console.log('💰 [ExpensesService] ==========================================');
    return paymentHistory;
  }
}
