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
exports.CargoFreightRate = void 0;
const typeorm_1 = require("typeorm");
let CargoFreightRate = class CargoFreightRate {
    id;
    origin;
    destination;
    min_weight_kg;
    max_weight_kg;
    rate_per_kg;
    currency;
    is_active;
    created_at;
    updated_at;
};
exports.CargoFreightRate = CargoFreightRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CargoFreightRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], CargoFreightRate.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], CargoFreightRate.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_weight_kg', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CargoFreightRate.prototype, "min_weight_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_weight_kg', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], CargoFreightRate.prototype, "max_weight_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], CargoFreightRate.prototype, "rate_per_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], CargoFreightRate.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CargoFreightRate.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CargoFreightRate.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CargoFreightRate.prototype, "updated_at", void 0);
exports.CargoFreightRate = CargoFreightRate = __decorate([
    (0, typeorm_1.Entity)('cargo_freight_rates')
], CargoFreightRate);
//# sourceMappingURL=cargo-freight-rate.entity.js.map