import { PurchaseOrdersService, PurchaseOrderStats } from './purchase-orders.service';
import type { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './purchase-orders.service';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    findAll(page?: number, limit?: number, search?: string, status?: string, supplierId?: number, startDate?: string, endDate?: string): Promise<{
        purchaseOrders: PurchaseOrder[];
        total: number;
    }>;
    getStats(): Promise<PurchaseOrderStats>;
    getBySupplier(supplierId: number): Promise<PurchaseOrder[]>;
    getSupplierStats(supplierId: number): Promise<{
        totalOrders: number;
        totalAmount: number;
        totalPaid: number;
        totalBalance: number;
        recentOrders: PurchaseOrder[];
    }>;
    findOne(id: number): Promise<PurchaseOrder>;
    create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder>;
    update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getPurchaseOrderItems(id: number): Promise<PurchaseOrderItem[]>;
    createPurchaseOrderWithItems(createData: {
        po_number: string;
        invoice_number: string;
        supplier_id: number;
        order_date: string;
        expected_delivery_date?: string;
        notes?: string;
        created_by: number;
        items: {
            product_id: number;
            quantity: number;
            unit_price: number;
            tax_amount?: number;
            tax_type?: string;
        }[];
    }): Promise<PurchaseOrder>;
}
