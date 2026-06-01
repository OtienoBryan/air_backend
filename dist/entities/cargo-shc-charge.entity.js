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
exports.CargoShcCharge = void 0;
const typeorm_1 = require("typeorm");
let CargoShcCharge = class CargoShcCharge {
    id;
    code;
    description;
    charge_amount;
    currency;
    charge_type;
    is_active;
    created_at;
    updated_at;
};
exports.CargoShcCharge = CargoShcCharge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CargoShcCharge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CargoShcCharge.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], CargoShcCharge.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'charge_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CargoShcCharge.prototype, "charge_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], CargoShcCharge.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'charge_type', type: 'varchar', length: 20, default: 'flat' }),
    __metadata("design:type", String)
], CargoShcCharge.prototype, "charge_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CargoShcCharge.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CargoShcCharge.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CargoShcCharge.prototype, "updated_at", void 0);
exports.CargoShcCharge = CargoShcCharge = __decorate([
    (0, typeorm_1.Entity)('cargo_shc_charges')
], CargoShcCharge);
//# sourceMappingURL=cargo-shc-charge.entity.js.map