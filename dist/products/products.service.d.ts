import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(page?: number, limit?: number): Promise<{
        products: Product[];
        total: number;
    }>;
    findOne(id: number, includeInactive?: boolean): Promise<Product>;
    search(searchTerm: string): Promise<Product[]>;
    update(id: number, updateProductDto: Partial<Product>): Promise<Product>;
}
