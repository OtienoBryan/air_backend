import { Repository } from 'typeorm';
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
    constructor(supplierRepository: Repository<Supplier>, supplierLedgerRepository: Repository<SupplierLedger>);
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        suppliers: Supplier[];
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
}
