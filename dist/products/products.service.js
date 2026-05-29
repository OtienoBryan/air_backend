"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
let ProductsService = class ProductsService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findAll(page = 1, limit = 10) {
        const [products, total] = await this.productRepository.findAndCount({
            where: { is_active: true },
            order: { product_name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { products, total };
    }
    async findOne(id, includeInactive = false) {
        const whereCondition = includeInactive ? { id } : { id, is_active: true };
        const product = await this.productRepository.findOne({
            where: whereCondition
        });
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }
    async search(searchTerm) {
        return this.productRepository
            .createQueryBuilder('product')
            .where('product.is_active = :isActive', { isActive: true })
            .andWhere('(product.product_name LIKE :search OR product.product_code LIKE :search OR product.description LIKE :search)', { search: `%${searchTerm}%` })
            .orderBy('product.product_name', 'ASC')
            .getMany();
    }
    async update(id, updateProductDto) {
        console.log(`📦 [ProductsService] Updating product ID: ${id}`);
        const product = await this.findOne(id, true);
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map