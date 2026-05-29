import { Supplier } from './supplier.entity';
import { Staff } from './staff.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    SENT = "sent",
    RECEIVED = "received",
    CANCELLED = "cancelled"
}
export declare class PurchaseOrder {
    id: number;
    po_number: string;
    invoice_number: string;
    supplier_id: number;
    order_date: Date;
    expected_delivery_date: Date | null;
    status: PurchaseOrderStatus;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    amount_paid: number;
    balance: number;
    notes: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
    supplier: Supplier;
    creator: Staff;
    items: PurchaseOrderItem[];
}
