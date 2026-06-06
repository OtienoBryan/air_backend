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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseType = void 0;
const typeorm_1 = require("typeorm");
const expense_category_entity_1 = require("./expense-category.entity");
let ExpenseType = class ExpenseType {
    id;
    name;
    category_id;
    category;
    description;
    is_active;
    created_at;
    updated_at;
};
exports.ExpenseType = ExpenseType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExpenseType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ExpenseType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ExpenseType.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_category_entity_1.ExpenseCategory, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Object)
], ExpenseType.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ExpenseType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], ExpenseType.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExpenseType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ExpenseType.prototype, "updated_at", void 0);
exports.ExpenseType = ExpenseType = __decorate([
    (0, typeorm_1.Entity)('expense_types')
], ExpenseType);
//# sourceMappingURL=expense-type.entity.js.map