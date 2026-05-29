import { DataSource } from 'typeorm';
export declare class InventorySimpleController {
    private dataSource;
    constructor(dataSource: DataSource);
    getAllInventory(): Promise<any[]>;
    getStores(): Promise<any[]>;
    getProducts(): Promise<any[]>;
}
