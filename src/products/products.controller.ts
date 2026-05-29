import { 
  Controller, 
  Get, 
  Put,
  Param, 
  ParseIntPipe, 
  Query,
  Body,
  UseGuards 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ products: Product[], total: number }> {
    console.log('🔍 [ProductsController] GET /admin/products', { page, limit, search });
    
    if (search) {
      const products = await this.productsService.search(search);
      return { products, total: products.length };
    }
    
    const result = await this.productsService.findAll(page, limit);
    
    console.log(`✅ [ProductsController] Returning ${result.products.length} products out of ${result.total} total`);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    console.log(`🔍 [ProductsController] GET /admin/products/${id}`);
    
    const product = await this.productsService.findOne(id);
    
    console.log(`✅ [ProductsController] Product ${id} found:`, product.product_name);
    return product;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: Partial<Product>
  ): Promise<Product> {
    console.log(`🔍 [ProductsController] PUT /admin/products/${id}`);
    console.log('🔍 [ProductsController] Update product data:', updateProductDto);
    
    const updatedProduct = await this.productsService.update(id, updateProductDto);
    
    console.log(`✅ [ProductsController] Product ${id} updated:`, updatedProduct.product_name);
    return updatedProduct;
  }
}
