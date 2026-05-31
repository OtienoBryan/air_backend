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
exports.Agency = void 0;
const typeorm_1 = require("typeorm");
let Agency = class Agency {
    id;
    name;
    contact;
    city;
    country;
    booking_limit;
    credit_limit;
    max_pax_per_booking;
    default_currency;
    credit_days;
    payment_limit;
    balance;
    commission_percentage;
    created_at;
    updated_at;
};
exports.Agency = Agency;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Agency.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Agency.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_limit', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "booking_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_limit', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "credit_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_pax_per_booking', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "max_pax_per_booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_currency', type: 'varchar', length: 3, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "default_currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_days', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "credit_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_limit', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "payment_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Agency.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Agency.prototype, "commission_percentage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Agency.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Agency.prototype, "updated_at", void 0);
exports.Agency = Agency = __decorate([
    (0, typeorm_1.Entity)('agencies')
], Agency);
//# sourceMappingURL=agency.entity.js.map