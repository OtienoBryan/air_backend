import { Client } from './client.entity';
export declare class ClientLedger {
    id: number;
    clientId: number;
    transactionDate: Date;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
    client: Client;
}
