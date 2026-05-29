import { Repository } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
export interface PurchaseOrderStats {
    total: number;
    draft: number;
    sent: number;
    received: number;
    cancelled: number;
    totalAmount: number;
    totalPaid: number;
    totalBalance: number;
}
export interface CreatePurchaseOrderDto {
    po_number: string;
    invoice_number: string;
    supplier_id: number;
    order_date: Date;
    expected_delivery_date?: Date;
    status?: PurchaseOrderStatus;
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    amount_paid: number;
    balance: number;
    notes?: string;
    created_by: number;
}
export interface UpdatePurchaseOrderDto {
    po_number?: string;
    invoice_number?: string;
    supplier_id?: number;
    order_date?: Date;
    expected_delivery_date?: Date;
    status?: PurchaseOrderStatus;
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    amount_paid?: number;
    balance?: number;
    notes?: string;
}
export declare class PurchaseOrdersService {
    private purchaseOrderRepository;
    private purchaseOrderItemRepository;
    constructor(purchaseOrderRepository: Repository<PurchaseOrder>, purchaseOrderItemRepository: Repository<PurchaseOrderItem>);
    findAll(page?: number, limit?: number, search?: string, status?: string, supplierId?: number, startDate?: string, endDate?: string): Promise<{
        purchaseOrders: PurchaseOrder[];
        total: number;
    }>;
    findBySupplier(supplierId: number): Promise<PurchaseOrder[]>;
    findOne(id: number): Promise<PurchaseOrder>;
    findByPoNumber(po_number: string): Promise<PurchaseOrder | null>;
    create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder>;
    update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder>;
    remove(id: number): Promise<void>;
    getStats(): Promise<PurchaseOrderStats>;
    getSupplierStats(supplierId: number): Promise<{
        totalOrders: number;
        totalAmount: number;
        totalPaid: number;
        totalBalance: number;
        recentOrders: PurchaseOrder[];
    }>;
    getPurchaseOrderItems(purchaseOrderId: number): Promise<PurchaseOrderItem[]>;
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
