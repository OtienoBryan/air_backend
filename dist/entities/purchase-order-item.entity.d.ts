import { PurchaseOrder } from './purchase-order.entity';
import { Product } from './product.entity';
export declare class PurchaseOrderItem {
    id: number;
    purchase_order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    received_quantity: number;
    tax_amount: number;
    tax_type: string;
    purchase_order: PurchaseOrder;
    product: Product;
}
