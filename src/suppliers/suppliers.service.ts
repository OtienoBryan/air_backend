import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';

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
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<{ suppliers: Supplier[], total: number }> {
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

    return { suppliers, total };
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
}
