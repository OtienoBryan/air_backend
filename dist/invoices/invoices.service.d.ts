import { Repository } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
export interface InvoiceData {
    id: number;
    soNumber: string;
    clientId: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    orderDate: Date;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    netPrice: number;
    notes: string | null;
    createdBy: string | null;
    salesrep: number | null;
    createdAt: Date;
    updatedAt: Date;
    riderId: number | null;
    assignedAt: Date | null;
    recipientsName: string | null;
    recipientsContact: string | null;
    dispatchedBy: number | null;
    status: string;
    receivedIntoStock: boolean;
    deliveredAt: Date | null;
    deliveryNotes: string | null;
    receivedBy: number | null;
    receivedAt: Date | null;
    deliveryImage: string | null;
    returnedAt: Date | null;
}
export interface InvoiceSummary {
    totalInvoices: number;
    totalAmount: number;
    totalSubtotal: number;
    totalTax: number;
    statusCounts: {
        draft: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        inPayment: number;
        paid: number;
    };
    myStatusCounts: {
        status1: number;
        status2: number;
        status3: number;
        status4: number;
        status5: number;
    };
}
export declare class InvoicesService {
    private salesOrderRepository;
    private clientRepository;
    private cache;
    private readonly CACHE_TTL;
    constructor(salesOrderRepository: Repository<SalesOrder>, clientRepository: Repository<Client>);
    private getCacheKey;
    private getCachedData;
    private setCachedData;
    private clearCache;
    getInvoices(page?: number, limit?: number, search?: string, status?: string, myStatus?: string): Promise<{
        invoices: InvoiceData[];
        total: number;
    }>;
    getInvoiceSummary(): Promise<InvoiceSummary>;
    getInvoiceOrderItems(invoiceId: number): Promise<any[]>;
    getInvoiceById(id: number): Promise<InvoiceData | null>;
}
