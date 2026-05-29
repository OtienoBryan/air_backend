import { SalesOrdersService, SalesAnalytics, ClientSalesData, OrderItem, ProductPerformanceData, ProductPerformanceSummary } from './sales-orders.service';
export declare class SalesOrdersController {
    private readonly salesOrdersService;
    constructor(salesOrdersService: SalesOrdersService);
    getSalesAnalytics(year?: number): Promise<SalesAnalytics>;
    getAllClientSalesData(year?: number): Promise<ClientSalesData[]>;
    getClientSalesData(clientId: number, year?: number): Promise<ClientSalesData | null>;
    getBulkClientSalesData(body: {
        clientIds: number[];
        year?: number;
    }): Promise<ClientSalesData[]>;
    getSalesOrders(year?: number, limit?: number, offset?: number): Promise<import("../entities/sales-order.entity").SalesOrder[]>;
    getAllClients(): Promise<import("../entities/client.entity").Client[]>;
    getClientSalesDataById(clientId: number, year?: number): Promise<ClientSalesData | null>;
    getClientOrderItems(clientId: number, year: number, month: number): Promise<OrderItem[]>;
    getProductPerformance(year?: number): Promise<ProductPerformanceData[]>;
    getProductPerformanceSummary(year?: number): Promise<ProductPerformanceSummary>;
}
