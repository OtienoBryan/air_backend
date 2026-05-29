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
exports.JournalEntry = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const journal_entry_line_entity_1 = require("./journal-entry-line.entity");
const expense_entity_1 = require("./expense.entity");
let JournalEntry = class JournalEntry {
    id;
    entry_number;
    entry_date;
    reference;
    description;
    total_debit;
    total_credit;
    status;
    created_by;
    creator;
    lines;
    expenses;
    created_at;
    updated_at;
};
exports.JournalEntry = JournalEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JournalEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entry_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], JournalEntry.prototype, "entry_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entry_date', type: 'date' }),
    __metadata("design:type", Date)
], JournalEntry.prototype, "entry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], JournalEntry.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], JournalEntry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_debit', type: 'decimal', precision: 15, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], JournalEntry.prototype, "total_debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_credit', type: 'decimal', precision: 15, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], JournalEntry.prototype, "total_credit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['draft', 'posted', 'cancelled'],
        default: 'draft'
    }),
    __metadata("design:type", String)
], JournalEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int' }),
    __metadata("design:type", Number)
], JournalEntry.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", staff_entity_1.Staff)
], JournalEntry.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_entry_line_entity_1.JournalEntryLine, line => line.journal_entry),
    __metadata("design:type", Array)
], JournalEntry.prototype, "lines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.Expense, expense => expense.journal_entry),
    __metadata("design:type", Array)
], JournalEntry.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], JournalEntry.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], JournalEntry.prototype, "updated_at", void 0);
exports.JournalEntry = JournalEntry = __decorate([
    (0, typeorm_1.Entity)('journal_entries')
], JournalEntry);
//# sourceMappingURL=journal-entry.entity.js.map