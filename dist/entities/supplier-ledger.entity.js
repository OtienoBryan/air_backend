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
exports.SupplierLedger = void 0;
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("./supplier.entity");
let SupplierLedger = class SupplierLedger {
    id;
    supplierId;
    date;
    description;
    referenceType;
    referenceId;
    debit;
    credit;
    runningBalance;
    createdAt;
    supplier;
};
exports.SupplierLedger = SupplierLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SupplierLedger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", Number)
], SupplierLedger.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'datetime' }),
    __metadata("design:type", Date)
], SupplierLedger.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SupplierLedger.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SupplierLedger.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SupplierLedger.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'debit', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SupplierLedger.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SupplierLedger.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'running_balance', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SupplierLedger.prototype, "runningBalance", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierLedger.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, supplier => supplier.id),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierLedger.prototype, "supplier", void 0);
exports.SupplierLedger = SupplierLedger = __decorate([
    (0, typeorm_1.Entity)('supplier_ledger')
], SupplierLedger);
//# sourceMappingURL=supplier-ledger.entity.js.map