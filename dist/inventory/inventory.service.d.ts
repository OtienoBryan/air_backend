import { Repository } from 'typeorm';
import { StoreInventory } from '../entities/store-inventory.entity';
export interface InventoryItem {
    id: number;
    store_id: number;
    product_id: number;
    quantity: number;
    product_name: string;
    store_name: string;
}
export declare class InventoryService {
    private storeInventoryRepository;
    constructor(storeInventoryRepository: Repository<StoreInventory>);
    getAllInventory(): Promise<InventoryItem[]>;
    getInventoryByStore(storeId: number): Promise<InventoryItem[]>;
    getInventoryByProduct(productId: number): Promise<InventoryItem[]>;
    updateInventoryQuantity(id: number, quantity: number): Promise<StoreInventory>;
    getStores(): Promise<any[]>;
    getProducts(): Promise<any[]>;
}
