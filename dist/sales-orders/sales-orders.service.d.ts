import { Repository } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';
import { SalesOrderItem } from '../entities/sales-order-item.entity';
import { Product } from '../entities/product.entity';
export interface OrderSummary {
    id: number;
    soNumber: string;
    orderDate: Date | string;
    totalAmount: number;
    status: string;
}
export interface MonthlySalesData {
    month: string;
    year: number;
    monthNumber: number;
    totalOrders: number;
    totalAmount: number;
    orders: OrderSummary[];
}
export interface ClientSalesData {
    clientId: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientCompany?: string;
    clientStatus: string;
    monthlyData: MonthlySalesData[];
    totalOrders: number;
    totalAmount: number;
    averageOrderValue: number;
}
export interface OrderItem {
    id: number;
    salesOrderId: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    orderDate: string;
    soNumber: string;
}
export interface ProductPerformanceData {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
    averagePrice: number;
    orderCount: number;
    lastSoldDate: Date;
    monthlyData: {
        month: string;
        monthNumber: number;
        quantity: number;
        revenue: number;
        orderCount: number;
    }[];
}
export interface ProductPerformanceSummary {
    totalProducts: number;
    totalRevenue: number;
    totalQuantitySold: number;
    averageOrderValue: number;
    topPerformingProduct: {
        productName: string;
        revenue: number;
    };
}
export interface SalesAnalytics {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    monthlyData: Array<{
        month: string;
        revenue: number;
        orders: number;
    }>;
    topClients: Array<{
        clientId: number;
        clientName: string;
        totalOrders: number;
        totalRevenue: number;
    }>;
}
export declare class SalesOrdersService {
    private salesOrderRepository;
    private clientRepository;
    private salesOrderItemRepository;
    private productRepository;
    constructor(salesOrderRepository: Repository<SalesOrder>, clientRepository: Repository<Client>, salesOrderItemRepository: Repository<SalesOrderItem>, productRepository: Repository<Product>);
    getSalesAnalytics(year?: number): Promise<SalesAnalytics>;
    getAllClients(): Promise<Client[]>;
    getClientSalesData(clientId: number, year?: number): Promise<ClientSalesData | null>;
    getBulkClientSalesData(clientIds: number[], year?: number): Promise<ClientSalesData[]>;
    getAllClientSalesData(year?: number): Promise<ClientSalesData[]>;
    getSalesOrders(year?: number, limit?: number, offset?: number): Promise<SalesOrder[]>;
    getClientOrderItems(clientId: number, year: number, month: number): Promise<OrderItem[]>;
    getProductPerformance(year?: number): Promise<ProductPerformanceData[]>;
    getProductPerformanceSummary(year?: number): Promise<ProductPerformanceSummary>;
}
