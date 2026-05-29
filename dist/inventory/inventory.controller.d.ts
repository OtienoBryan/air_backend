import { InventoryService, InventoryItem } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAllInventory(): Promise<InventoryItem[]>;
    getStores(): Promise<any[]>;
    getProducts(): Promise<any[]>;
    getInventoryByStore(storeId: number): Promise<InventoryItem[]>;
    getInventoryByProduct(productId: number): Promise<InventoryItem[]>;
    updateQuantity(id: number, quantity: number): Promise<{
        message: string;
        inventory: any;
    }>;
}
