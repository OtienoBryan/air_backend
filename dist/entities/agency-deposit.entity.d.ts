import { Agency } from './agency.entity';
import { Account } from './account.entity';
export declare class AgencyDeposit {
    id: number;
    agencyId: number;
    accountId: number;
    amount: number;
    datePaid: Date;
    description: string;
    paymentMethod: string;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
    agency?: Agency;
    account?: Account;
}
