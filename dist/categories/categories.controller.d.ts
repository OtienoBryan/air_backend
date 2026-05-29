import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(createCategoryDto: Partial<Category>): Promise<Category>;
    update(id: number, updateCategoryDto: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
