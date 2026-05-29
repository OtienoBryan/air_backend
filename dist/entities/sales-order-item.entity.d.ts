import { SalesOrder } from './sales-order.entity';
export declare class SalesOrderItem {
    id: number;
    salesOrderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    totalPrice: number;
    taxType: '16%' | 'zero_rated' | 'exempted';
    netPrice: number;
    unitCost: number;
    costPrice: number;
    shippedQuantity: number;
    salesOrder: SalesOrder;
}
