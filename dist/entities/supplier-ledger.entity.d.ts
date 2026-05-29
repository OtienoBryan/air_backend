import { Supplier } from './supplier.entity';
export declare class SupplierLedger {
    id: number;
    supplierId: number;
    date: Date;
    description: string;
    referenceType: string | null;
    referenceId: number | null;
    debit: number;
    credit: number;
    runningBalance: number;
    createdAt: Date;
    supplier: Supplier;
}
