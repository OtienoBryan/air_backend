import { ReceivableAgingService, ReceivableAgingData, ReceivableAgingSummary } from './receivable-aging.service';
export declare class ReceivableAgingController {
    private readonly receivableAgingService;
    constructor(receivableAgingService: ReceivableAgingService);
    getReceivableAging(): Promise<ReceivableAgingData[]>;
    getReceivableAgingSummary(): Promise<ReceivableAgingSummary>;
}
