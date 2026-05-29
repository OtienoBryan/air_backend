export declare class Product {
    id: number;
    product_code: string;
    product_name: string;
    description: string;
    categoryId: number;
    category: string;
    unit_of_measure: string;
    cost_price: number;
    selling_price: number;
    tax_type: string;
    reorder_level: number;
    current_stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    image_url: string;
}
