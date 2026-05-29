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
exports.Aircraft = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const staff_entity_1 = require("./staff.entity");
let Aircraft = class Aircraft {
    id;
    name;
    registration;
    capacity;
    max_cargo_weight;
    category_id;
    category;
    created_by;
    createdByStaff;
    status;
    calendar_color;
    created_at;
    updated_at;
};
exports.Aircraft = Aircraft;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Aircraft.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Aircraft.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Aircraft.prototype, "registration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Aircraft.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_cargo_weight', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Aircraft.prototype, "max_cargo_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Aircraft.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Aircraft.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Aircraft.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", staff_entity_1.Staff)
], Aircraft.prototype, "createdByStaff", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'active' }),
    __metadata("design:type", String)
], Aircraft.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'calendar_color', type: 'varchar', length: 7, nullable: true, default: '#3B82F6' }),
    __metadata("design:type", String)
], Aircraft.prototype, "calendar_color", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Aircraft.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Aircraft.prototype, "updated_at", void 0);
exports.Aircraft = Aircraft = __decorate([
    (0, typeorm_1.Entity)('aircrafts')
], Aircraft);
//# sourceMappingURL=aircraft.entity.js.map