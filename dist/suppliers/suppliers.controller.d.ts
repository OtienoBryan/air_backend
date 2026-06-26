import { SuppliersService, SupplierStats, PayablesAgingSummary } from './suppliers.service';
import type { CreateSupplierDto, UpdateSupplierDto } from './suppliers.service';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { PostSupplierPaymentDto } from './dto/post-supplier-payment.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        suppliers: (Supplier & {
            current_balance: number;
        })[];
        total: number;
    }>;
    getStats(): Promise<SupplierStats>;
    searchSuppliers(searchTerm: string): Promise<Supplier[]>;
    getLedger(id: number): Promise<SupplierLedger[]>;
    postPayment(id: number, dto: PostSupplierPaymentDto, req: any): Promise<{
        supplier: Supplier;
        ledgerEntry: SupplierLedger;
        journalEntry: JournalEntry;
    }>;
    findOne(id: number): Promise<Supplier>;
    create(createSupplierDto: CreateSupplierDto): Promise<Supplier>;
    update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getPayablesAging(): Promise<PayablesAgingSummary>;
    getSupplierInvoicesByAging(supplierId: number, agingPeriod: 'current' | 'days31_60' | 'days61_90' | 'days91_120' | 'days120_plus'): Promise<SupplierLedger[]>;
}
