import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number }> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { is_active: true },
      order: { product_name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }

  async findOne(id: number, includeInactive: boolean = false): Promise<Product> {
    const whereCondition = includeInactive ? { id } : { id, is_active: true };
    const product = await this.productRepository.findOne({
      where: whereCondition
    });
    
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async search(searchTerm: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere(
        '(product.product_name LIKE :search OR product.product_code LIKE :search OR product.description LIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .orderBy('product.product_name', 'ASC')
      .getMany();
  }

  async update(id: number, updateProductDto: Partial<Product>): Promise<Product> {
    console.log(`📦 [ProductsService] Updating product ID: ${id}`);
    
    const product = await this.findOne(id, true); // Allow updating inactive products
    
    // Update product fields
    Object.assign(product, {
      product_code: updateProductDto.product_code ?? product.product_code,
      product_name: updateProductDto.product_name ?? product.product_name,
      description: updateProductDto.description ?? product.description,
      category: updateProductDto.category ?? product.category,
      categoryId: updateProductDto.categoryId ?? product.categoryId,
      unit_of_measure: updateProductDto.unit_of_measure ?? product.unit_of_measure,
      cost_price: updateProductDto.cost_price ?? product.cost_price,
      selling_price: updateProductDto.selling_price ?? product.selling_price,
      tax_type: updateProductDto.tax_type ?? product.tax_type,
      reorder_level: updateProductDto.reorder_level ?? product.reorder_level,
      current_stock: updateProductDto.current_stock ?? product.current_stock,
      is_active: updateProductDto.is_active !== undefined ? updateProductDto.is_active : product.is_active,
      image_url: updateProductDto.image_url ?? product.image_url,
    });
    
    const updatedProduct = await this.productRepository.save(product);
    console.log(`✅ [ProductsService] Product updated: ${updatedProduct.product_name}`);
    return updatedProduct;
  }
}
