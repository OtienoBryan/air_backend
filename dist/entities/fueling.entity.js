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
exports.Fueling = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const supplier_entity_1 = require("./supplier.entity");
const journal_entry_entity_1 = require("./journal-entry.entity");
let Fueling = class Fueling {
    id;
    flight_series_id;
    flightSeries;
    supplier_id;
    supplier;
    fuel_quantity;
    fuel_slip_number;
    price_per_liter;
    location;
    additional_fees;
    additional_fees_explanation;
    tax;
    total_amount;
    fueling_date;
    journal_entry_id;
    journal_entry;
    created_at;
    updated_at;
};
exports.Fueling = Fueling;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Fueling.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int' }),
    __metadata("design:type", Number)
], Fueling.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], Fueling.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int' }),
    __metadata("design:type", Number)
], Fueling.prototype, "supplier_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], Fueling.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fuel_quantity', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Fueling.prototype, "fuel_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fuel_slip_number', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Fueling.prototype, "fuel_slip_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_per_liter', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Fueling.prototype, "price_per_liter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Fueling.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'additional_fees', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Fueling.prototype, "additional_fees", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'additional_fees_explanation', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Fueling.prototype, "additional_fees_explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Fueling.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Fueling.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fueling_date', type: 'date' }),
    __metadata("design:type", Date)
], Fueling.prototype, "fueling_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_entry_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Fueling.prototype, "journal_entry_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entry_entity_1.JournalEntry),
    (0, typeorm_1.JoinColumn)({ name: 'journal_entry_id' }),
    __metadata("design:type", journal_entry_entity_1.JournalEntry)
], Fueling.prototype, "journal_entry", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Fueling.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Fueling.prototype, "updated_at", void 0);
exports.Fueling = Fueling = __decorate([
    (0, typeorm_1.Entity)('fueling')
], Fueling);
//# sourceMappingURL=fueling.entity.js.map