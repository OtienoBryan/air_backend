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
exports.CargoHandlingFee = void 0;
const typeorm_1 = require("typeorm");
let CargoHandlingFee = class CargoHandlingFee {
    id;
    name;
    description;
    amount;
    currency;
    fee_type;
    is_active;
    created_at;
    updated_at;
};
exports.CargoHandlingFee = CargoHandlingFee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CargoHandlingFee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CargoHandlingFee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CargoHandlingFee.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CargoHandlingFee.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], CargoHandlingFee.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_type', type: 'varchar', length: 20, default: 'per_shipment' }),
    __metadata("design:type", String)
], CargoHandlingFee.prototype, "fee_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CargoHandlingFee.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CargoHandlingFee.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CargoHandlingFee.prototype, "updated_at", void 0);
exports.CargoHandlingFee = CargoHandlingFee = __decorate([
    (0, typeorm_1.Entity)('cargo_handling_fees')
], CargoHandlingFee);
//# sourceMappingURL=cargo-handling-fee.entity.js.map