import { DataSource } from 'typeorm';
export declare class ReportsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getProfitReport(groupBy: 'route' | 'aircraft' | 'flight', from?: string, to?: string): Promise<any[]>;
    private routeReport;
    private aircraftReport;
    private flightReport;
    private buildRow;
}
