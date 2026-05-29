import { InvoicesService, InvoiceData, InvoiceSummary } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    getInvoices(page?: number, limit?: number, search?: string, status?: string, myStatus?: string): Promise<{
        invoices: InvoiceData[];
        total: number;
    }>;
    getInvoiceSummary(): Promise<InvoiceSummary>;
    getInvoiceById(id: number): Promise<InvoiceData | null>;
    getInvoiceOrderItems(id: number): Promise<any[]>;
}
