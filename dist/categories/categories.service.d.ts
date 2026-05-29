import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(createCategoryDto: Partial<Category>): Promise<Category>;
    update(id: number, updateCategoryDto: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<void>;
}
