import { Agency } from './agency.entity';
export declare class AgencyLedger {
    id: number;
    agencyId: number;
    transactionDate: Date;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
    agency: Agency;
}
