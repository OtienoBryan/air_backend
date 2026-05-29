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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoriesService = class CategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        console.log('📁 [CategoriesService] Finding all categories');
        const categories = await this.categoryRepository.find({
            order: { name: 'ASC' },
        });
        console.log(`✅ [CategoriesService] Found ${categories.length} categories`);
        return categories;
    }
    async findOne(id) {
        console.log(`📁 [CategoriesService] Finding category by ID: ${id}`);
        const category = await this.categoryRepository.findOne({
            where: { id }
        });
        if (!category) {
            console.log(`❌ [CategoriesService] Category with ID ${id} not found`);
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        console.log(`✅ [CategoriesService] Category found: ${category.name}`);
        return category;
    }
    async create(createCategoryDto) {
        console.log('📁 [CategoriesService] Creating new category:', createCategoryDto.name);
        const category = this.categoryRepository.create({
            name: createCategoryDto.name,
            description: createCategoryDto.description || null,
        });
        const savedCategory = await this.categoryRepository.save(category);
        console.log(`✅ [CategoriesService] Category created with ID: ${savedCategory.id}`);
        return savedCategory;
    }
    async update(id, updateCategoryDto) {
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
    async remove(id) {
        console.log(`📁 [CategoriesService] Deleting category ID: ${id}`);
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        console.log(`✅ [CategoriesService] Category deleted: ${category.name}`);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map