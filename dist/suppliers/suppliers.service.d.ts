import { Repository, DataSource } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
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
    current: number;
    days31_60: number;
    days61_90: number;
    days91_120: number;
    days120_plus: number;
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
export declare class SuppliersService {
    private supplierRepository;
    private supplierLedgerRepository;
    private journalEntryRepository;
    private dataSource;
    constructor(supplierRepository: Repository<Supplier>, supplierLedgerRepository: Repository<SupplierLedger>, journalEntryRepository: Repository<JournalEntry>, dataSource: DataSource);
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        suppliers: (Supplier & {
            current_balance: number;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<Supplier>;
    findByCode(supplier_code: string): Promise<Supplier | null>;
    create(createSupplierDto: CreateSupplierDto): Promise<Supplier>;
    update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: number): Promise<void>;
    getStats(): Promise<SupplierStats>;
    searchSuppliers(searchTerm: string): Promise<Supplier[]>;
    getPayablesAging(): Promise<PayablesAgingSummary>;
    getSupplierInvoicesByAging(supplierId: number, agingPeriod: 'current' | 'days31_60' | 'days61_90' | 'days91_120' | 'days120_plus'): Promise<SupplierLedger[]>;
    getLedger(supplierId: number): Promise<SupplierLedger[]>;
    private generateEntryNumber;
    postPayment(supplierId: number, dto: PostSupplierPaymentDto, createdBy?: number | null): Promise<{
        supplier: Supplier;
        ledgerEntry: SupplierLedger;
        journalEntry: JournalEntry;
    }>;
}
