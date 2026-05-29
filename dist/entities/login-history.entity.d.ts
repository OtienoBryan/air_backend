import { SalesRep } from './sales-rep.entity';
export declare class LoginHistory {
    id: number;
    userId: number;
    timezone: string;
    duration: number;
    status: number;
    sessionEnd: string;
    sessionStart: string;
    salesRep?: SalesRep;
}
