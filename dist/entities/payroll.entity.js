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
exports.Payroll = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
let Payroll = class Payroll {
    id;
    journal_entry_id;
    staff_id;
    payroll_date;
    amount;
    description;
    reference;
    created_at;
    journal_entry;
    staff;
};
exports.Payroll = Payroll;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payroll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', type: 'int' }),
    __metadata("design:type", Number)
], Payroll.prototype, "journal_entry_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id', type: 'int' }),
    __metadata("design:type", Number)
], Payroll.prototype, "staff_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payroll_date', type: 'date' }),
    __metadata("design:type", Date)
], Payroll.prototype, "payroll_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Payroll.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Payroll.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Payroll.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Payroll.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry),
    (0, typeorm_1.JoinColumn)({ name: 'journal_entry_id' }),
    __metadata("design:type", journal_entry_entity_1.JournalEntry)
], Payroll.prototype, "journal_entry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], Payroll.prototype, "staff", void 0);
exports.Payroll = Payroll = __decorate([
    (0, typeorm_1.Entity)('payroll')
], Payroll);
//# sourceMappingURL=payroll.entity.js.map