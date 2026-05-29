import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { SalesRep } from '../entities/sales-rep.entity';
export interface AttendanceRecord {
    id: number;
    userId: number;
    salesRepName: string;
    salesRepEmail: string;
    timezone: string;
    duration: number;
    status: number;
    sessionStart: string;
    sessionEnd: string;
    country: string;
    region: string;
    route: string;
}
export interface AttendanceStats {
    totalSessions: number;
    totalDuration: number;
    averageSessionDuration: number;
    activeSalesReps: number;
    byStatus: Record<number, number>;
    byCountry: Record<string, number>;
    byRegion: Record<string, number>;
}
export declare class SalesRepAttendanceService {
    private loginHistoryRepository;
    private salesRepRepository;
    constructor(loginHistoryRepository: Repository<LoginHistory>, salesRepRepository: Repository<SalesRep>);
    getAttendanceRecords(salesRepId?: number, startDate?: string, endDate?: string, status?: number, limit?: number, offset?: number): Promise<AttendanceRecord[]>;
    getAttendanceStats(startDate?: string, endDate?: string): Promise<AttendanceStats>;
    getSalesReps(): Promise<SalesRep[]>;
}
