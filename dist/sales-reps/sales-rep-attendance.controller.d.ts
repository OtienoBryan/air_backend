import { SalesRepAttendanceService, AttendanceRecord, AttendanceStats } from './sales-rep-attendance.service';
export declare class SalesRepAttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: SalesRepAttendanceService);
    getAttendanceRecords(salesRepId?: string, startDate?: string, endDate?: string, status?: string, limit?: string, offset?: string): Promise<AttendanceRecord[]>;
    getAttendanceStats(startDate?: string, endDate?: string): Promise<AttendanceStats>;
    getSalesReps(): Promise<import("../entities").SalesRep[]>;
}
