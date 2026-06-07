import { DataSource } from 'typeorm';
export declare class ReportsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getProfitReport(groupBy: 'route' | 'aircraft' | 'flight', from?: string, to?: string): Promise<any[]>;
    private routeReport;
    private aircraftReport;
    private flightReport;
    getRevenueDetail(groupBy: 'route' | 'aircraft' | 'flight', id: number, from?: string, to?: string): Promise<any[]>;
    getExpenseDetail(groupBy: 'route' | 'aircraft' | 'flight', id: number, from?: string, to?: string): Promise<any[]>;
    private buildRow;
}
