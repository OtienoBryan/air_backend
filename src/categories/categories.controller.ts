import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    console.log('📁 [CategoriesController] GET /admin/categories');
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    console.log(`📁 [CategoriesController] GET /admin/categories/${id}`);
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoryDto: Partial<Category>): Promise<Category> {
    console.log('📁 [CategoriesController] POST /admin/categories');
    console.log('📁 [CategoriesController] Create category data:', createCategoryDto);
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: Partial<Category>
  ): Promise<Category> {
    console.log(`📁 [CategoriesController] PUT /admin/categories/${id}`);
    console.log('📁 [CategoriesController] Update category data:', updateCategoryDto);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`📁 [CategoriesController] DELETE /admin/categories/${id}`);
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}

