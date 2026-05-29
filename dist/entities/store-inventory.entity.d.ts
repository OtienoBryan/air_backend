import { Product } from './product.entity';
export declare class StoreInventory {
    id: number;
    store_id: number;
    product_id: number;
    quantity: number;
    product: Product;
}
