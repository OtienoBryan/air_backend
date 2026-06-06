import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getProfitReport(groupBy?: 'route' | 'aircraft' | 'flight', from?: string, to?: string): Promise<any[]>;
}
