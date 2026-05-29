import { Repository } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
import { ClientLedger } from '../entities/client-ledger.entity';
export interface ReceivableAgingData {
    clientId: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    totalOutstanding: number;
    current: number;
    days31to60: number;
    days61to90: number;
    days91to120: number;
    over120Days: number;
    lastPaymentDate: Date | null;
    lastPaymentAmount: number;
}
export interface ReceivableAgingSummary {
    totalOutstanding: number;
    totalClients: number;
    currentTotal: number;
    days31to60Total: number;
    days61to90Total: number;
    days91to120Total: number;
    over120DaysTotal: number;
}
export declare class ReceivableAgingService {
    private salesOrderRepository;
    private clientRepository;
    private clientLedgerRepository;
    constructor(salesOrderRepository: Repository<SalesOrder>, clientRepository: Repository<Client>, clientLedgerRepository: Repository<ClientLedger>);
    getReceivableAging(): Promise<ReceivableAgingData[]>;
    getReceivableAgingSummary(): Promise<ReceivableAgingSummary>;
}
