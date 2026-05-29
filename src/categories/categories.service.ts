import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    console.log('📁 [CategoriesService] Finding all categories');
    
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
    
    console.log(`✅ [CategoriesService] Found ${categories.length} categories`);
    return categories;
  }

  async findOne(id: number): Promise<Category> {
    console.log(`📁 [CategoriesService] Finding category by ID: ${id}`);
    
    const category = await this.categoryRepository.findOne({
      where: { id }
    });
    
    if (!category) {
      console.log(`❌ [CategoriesService] Category with ID ${id} not found`);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    console.log(`✅ [CategoriesService] Category found: ${category.name}`);
    return category;
  }

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    console.log('📁 [CategoriesService] Creating new category:', createCategoryDto.name);
    
    const category = this.categoryRepository.create({
      name: createCategoryDto.name!,
      description: createCategoryDto.description || null,
    } as Category);
    
    const savedCategory = await this.categoryRepository.save(category);
    console.log(`✅ [CategoriesService] Category created with ID: ${savedCategory.id}`);
    return savedCategory;
  }

  async update(id: number, updateCategoryDto: Partial<Category>): Promise<Category> {
    console.log(`📁 [CategoriesService] Updating category ID: ${id}`);
    
    const category = await this.findOne(id);
    
    Object.assign(category, {
      name: updateCategoryDto.name ?? category.name,
      description: updateCategoryDto.description ?? category.description,
    });
    
    const updatedCategory = await this.categoryRepository.save(category);
    console.log(`✅ [CategoriesService] Category updated: ${updatedCategory.name}`);
    return updatedCategory;
  }

  async remove(id: number): Promise<void> {
    console.log(`📁 [CategoriesService] Deleting category ID: ${id}`);
    
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    
    console.log(`✅ [CategoriesService] Category deleted: ${category.name}`);
  }
}

