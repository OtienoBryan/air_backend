import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan, DataSource } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { PostSupplierPaymentDto } from './dto/post-supplier-payment.dto';

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  totalCreditLimit: number;
}

export interface CreateSupplierDto {
  supplier_code: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  payment_terms?: number;
  credit_limit?: number;
  is_active?: boolean;
}

export interface UpdateSupplierDto {
  supplier_code?: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  payment_terms?: number;
  credit_limit?: number;
  is_active?: boolean;
}

export interface PayablesAgingItem {
  supplier_id: number;
  supplier_code: string;
  company_name: string;
  current: number; // 0-30 days
  days31_60: number; // 31-60 days
  days61_90: number; // 61-90 days
  days91_120: number; // 91-120 days
  days120_plus: number; // 120+ days
  total: number;
}

export interface PayablesAgingSummary {
  items: PayablesAgingItem[];
  totals: {
    current: number;
    days31_60: number;
    days61_90: number;
    days91_120: number;
    days120_plus: number;
    total: number;
  };
}

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(SupplierLedger)
    private supplierLedgerRepository: Repository<SupplierLedger>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    private dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<{ suppliers: (Supplier & { current_balance: number })[], total: number }> {
    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(supplier.company_name LIKE :search OR supplier.contact_person LIKE :search OR supplier.email LIKE :search OR supplier.supplier_code LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply status filter
    if (status === 'active') {
      queryBuilder.andWhere('supplier.is_active = :active', { active: true });
    } else if (status === 'inactive') {
      queryBuilder.andWhere('supplier.is_active = :active', { active: false });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by company name
    queryBuilder.orderBy('supplier.company_name', 'ASC');

    const [suppliers, total] = await queryBuilder.getManyAndCount();

    // Attach each supplier's current balance (latest running_balance on their ledger)
    const supplierIds = suppliers.map(s => s.id);
    const balanceMap = new Map<number, number>();
    if (supplierIds.length > 0) {
      const latestRows: { supplier_id: number; running_balance: string }[] = await this.supplierLedgerRepository.query(
        `SELECT sl.supplier_id, sl.running_balance
         FROM supplier_ledger sl
         WHERE sl.id = (
           SELECT sl2.id FROM supplier_ledger sl2
           WHERE sl2.supplier_id = sl.supplier_id
           ORDER BY sl2.date DESC, sl2.created_at DESC, sl2.id DESC
           LIMIT 1
         )
         AND sl.supplier_id IN (${supplierIds.join(',')})`
      );
      for (const row of latestRows) {
        balanceMap.set(Number(row.supplier_id), Number(row.running_balance));
      }
    }

    const suppliersWithBalance = suppliers.map(s => ({
      ...s,
      current_balance: balanceMap.get(s.id) ?? 0,
    }));

    return { suppliers: suppliersWithBalance, total };
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async findByCode(supplier_code: string): Promise<Supplier | null> {
    return this.supplierRepository.findOne({ where: { supplier_code } });
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    // Check if supplier code already exists
    const existingSupplier = await this.findByCode(createSupplierDto.supplier_code);
    if (existingSupplier) {
      throw new Error('Supplier code already exists');
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);

    // Check if new supplier code already exists (if being updated)
    if (updateSupplierDto.supplier_code && updateSupplierDto.supplier_code !== supplier.supplier_code) {
      const existingSupplier = await this.findByCode(updateSupplierDto.supplier_code);
      if (existingSupplier) {
        throw new Error('Supplier code already exists');
      }
    }

    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }

  async getStats(): Promise<SupplierStats> {
    const total = await this.supplierRepository.count();
    const active = await this.supplierRepository.count({ where: { is_active: true } });
    const inactive = total - active;
    
    const result = await this.supplierRepository
      .createQueryBuilder('supplier')
      .select('SUM(supplier.credit_limit)', 'totalCreditLimit')
      .where('supplier.is_active = :active', { active: true })
      .getRawOne();

    return {
      total,
      active,
      inactive,
      totalCreditLimit: parseFloat(result.totalCreditLimit) || 0,
    };
  }

  async searchSuppliers(searchTerm: string): Promise<Supplier[]> {
    if (!searchTerm) {
      return this.supplierRepository.find({ order: { company_name: 'ASC' } });
    }

    return this.supplierRepository.find({
      where: [
        { company_name: Like(`%${searchTerm}%`) },
        { contact_person: Like(`%${searchTerm}%`) },
        { email: Like(`%${searchTerm}%`) },
        { supplier_code: Like(`%${searchTerm}%`) },
      ],
      order: { company_name: 'ASC' },
    });
  }

  async getPayablesAging(): Promise<PayablesAgingSummary> {
    console.log('📊 [SuppliersService] Calculating payables aging analysis');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all suppliers with outstanding payables (positive running balance)
    const suppliersWithPayables = await this.supplierLedgerRepository
      .createQueryBuilder('ledger')
      .select('ledger.supplierId', 'supplier_id')
      .addSelect('MAX(ledger.runningBalance)', 'balance')
      .where('ledger.runningBalance > 0')
      .groupBy('ledger.supplierId')
      .getRawMany();

    console.log(`📊 [SuppliersService] Found ${suppliersWithPayables.length} suppliers with outstanding payables`);

    const items: PayablesAgingItem[] = [];
    const totals = {
      current: 0,
      days31_60: 0,
      days61_90: 0,
      days91_120: 0,
      days120_plus: 0,
      total: 0,
    };

    for (const supplierPayable of suppliersWithPayables) {
      const supplierId = supplierPayable.supplier_id;
      
      // Get supplier details
      const supplier = await this.supplierRepository.findOne({ where: { id: supplierId } });
      if (!supplier) continue;

      // Get all credit transactions (payables) for this supplier
      const creditTransactions = await this.supplierLedgerRepository.find({
        where: { supplierId, credit: MoreThan(0) },
        order: { date: 'ASC' },
      });

      // Calculate aging buckets
      let current = 0;
      let days31_60 = 0;
      let days61_90 = 0;
      let days91_120 = 0;
      let days120_plus = 0;

      // We need to track which credits have been paid by debits
      // This is a simplified approach - in reality, we'd need to match debits to credits
      // For now, we'll use the running balance approach
      
      // Get the latest balance
      const latestLedger = await this.supplierLedgerRepository.findOne({
        where: { supplierId },
        order: { date: 'DESC', createdAt: 'DESC' },
      });

      const totalPayable = latestLedger ? Number(latestLedger.runningBalance) : 0;

      if (totalPayable > 0) {
        // For aging, we'll use the date of the most recent credit transaction
        // In a more sophisticated system, you'd track each invoice separately
        const mostRecentCredit = creditTransactions[creditTransactions.length - 1];
        
        if (mostRecentCredit) {
          const transactionDate = new Date(mostRecentCredit.date);
          transactionDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 30) {
            current = totalPayable;
          } else if (daysDiff <= 60) {
            days31_60 = totalPayable;
          } else if (daysDiff <= 90) {
            days61_90 = totalPayable;
          } else if (daysDiff <= 120) {
            days91_120 = totalPayable;
          } else {
            days120_plus = totalPayable;
          }
        } else {
          // If no credit transactions, put in current
          current = totalPayable;
        }
      }

      if (totalPayable > 0) {
        items.push({
          supplier_id: supplierId,
          supplier_code: supplier.supplier_code,
          company_name: supplier.company_name,
          current,
          days31_60,
          days61_90,
          days91_120,
          days120_plus,
          total: totalPayable,
        });

        totals.current += current;
        totals.days31_60 += days31_60;
        totals.days61_90 += days61_90;
        totals.days91_120 += days91_120;
        totals.days120_plus += days120_plus;
        totals.total += totalPayable;
      }
    }

    // Sort by total descending
    items.sort((a, b) => b.total - a.total);

    console.log(`📊 [SuppliersService] Aging analysis complete: ${items.length} suppliers, Total: ${totals.total}`);

    return { items, totals };
  }

  async getSupplierInvoicesByAging(
    supplierId: number,
    agingPeriod: 'current' | 'days31_60' | 'days61_90' | 'days91_120' | 'days120_plus'
  ): Promise<SupplierLedger[]> {
    console.log(`📊 [SuppliersService] Getting invoices for supplier ${supplierId}, aging period: ${agingPeriod}`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all credit transactions (invoices/payables) for this supplier
    const allCreditTransactions = await this.supplierLedgerRepository.find({
      where: {
        supplierId,
        credit: MoreThan(0),
      },
      order: { date: 'DESC' },
    });
    
    // Filter by aging period based on days since invoice date
    const filteredInvoices = allCreditTransactions.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      invoiceDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (agingPeriod) {
        case 'current':
          return daysDiff <= 30;
        case 'days31_60':
          return daysDiff > 30 && daysDiff <= 60;
        case 'days61_90':
          return daysDiff > 60 && daysDiff <= 90;
        case 'days91_120':
          return daysDiff > 90 && daysDiff <= 120;
        case 'days120_plus':
          return daysDiff > 120;
        default:
          return false;
      }
    });
    
    console.log(`📊 [SuppliersService] Found ${filteredInvoices.length} invoices for aging period ${agingPeriod}`);
    return filteredInvoices;
  }

  async getLedger(supplierId: number): Promise<SupplierLedger[]> {
    return this.supplierLedgerRepository.find({
      where: { supplierId },
      order: { id: 'DESC' },
    });
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    const latestEntry = await this.journalEntryRepository.findOne({
      where: { entry_number: Like(`JE-${datePrefix}-%`) },
      order: { entry_number: 'DESC' },
    });

    let sequence = 1;
    if (latestEntry) {
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2] || '0', 10) + 1;
      }
    }

    return `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  // Posts a payment to a supplier: debits accounts payable (type 10) and credits the
  // chosen cash/bank account (type 9), records the double-entry in journal_entries +
  // journal_entry_lines, appends a debit row to supplier_ledger, and refreshes the
  // running balance both on the ledger row and on suppliers.balance.
  async postPayment(
    supplierId: number,
    dto: PostSupplierPaymentDto,
    createdBy: number | null = null,
  ): Promise<{ supplier: Supplier; ledgerEntry: SupplierLedger; journalEntry: JournalEntry }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const supplier = await queryRunner.manager.findOne(Supplier, { where: { id: supplierId } });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
      }

      const paymentAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { id: dto.payment_account_id, account_type: 9 },
      });
      if (!paymentAccount) {
        throw new BadRequestException(`Payment account with ID ${dto.payment_account_id} not found or is not a bank/cash account`);
      }

      const accountsPayableAccount = await queryRunner.manager.findOne(ChartOfAccount, {
        where: { account_type: 10 },
      });
      if (!accountsPayableAccount) {
        throw new BadRequestException('Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts');
      }

      const entryDate = dto.payment_date ? new Date(dto.payment_date) : new Date();
      const entryNumber = await this.generateEntryNumber();

      const journalEntry = queryRunner.manager.create(JournalEntry, {
        entry_number: entryNumber,
        entry_date: entryDate,
        reference: dto.reference || null,
        description: dto.description || `Payment to supplier: ${supplier.company_name}`,
        total_debit: dto.amount,
        total_credit: dto.amount,
        status: 'posted',
        created_by: createdBy || 1,
      });
      const savedJournalEntry = await queryRunner.manager.save(JournalEntry, journalEntry);

      const debitLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedJournalEntry.id,
        account_id: accountsPayableAccount.id,
        debit_amount: dto.amount,
        credit_amount: 0,
        description: `Payment reducing accounts payable: ${supplier.company_name}`,
      });
      const creditLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedJournalEntry.id,
        account_id: paymentAccount.id,
        debit_amount: 0,
        credit_amount: dto.amount,
        description: `Payment via ${paymentAccount.name}`,
      });
      await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);

      const latestLedger = await queryRunner.manager.findOne(SupplierLedger, {
        where: { supplierId },
        order: { date: 'DESC', createdAt: 'DESC', id: 'DESC' },
      });
      const currentBalance = latestLedger ? Number(latestLedger.runningBalance) : Number(supplier.balance || 0);
      const newBalance = currentBalance - dto.amount;

      const ledgerEntry = queryRunner.manager.create(SupplierLedger, {
        supplierId,
        date: entryDate,
        description: dto.description || `Payment - ${entryNumber}`,
        debit: dto.amount,
        credit: 0,
        runningBalance: newBalance,
        referenceType: 'SUPPLIER_PAYMENT',
        referenceId: savedJournalEntry.id,
      });
      const savedLedgerEntry = await queryRunner.manager.save(SupplierLedger, ledgerEntry);

      await queryRunner.manager.update(Supplier, supplierId, { balance: newBalance });

      await queryRunner.commitTransaction();

      const updatedSupplier = await this.supplierRepository.findOne({ where: { id: supplierId } });
      return { supplier: updatedSupplier!, ledgerEntry: savedLedgerEntry, journalEntry: savedJournalEntry };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
