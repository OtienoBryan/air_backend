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
exports.CargoBooking = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const flight_entity_1 = require("./flight.entity");
let CargoBooking = class CargoBooking {
    id;
    awb_number;
    flight_series_id;
    flightSeries;
    flight_id;
    flight;
    origin;
    destination;
    shipper_name;
    shipper_phone;
    shipper_address;
    consignee_name;
    consignee_phone;
    consignee_address;
    commodity_type;
    special_handling_codes;
    pieces;
    gross_weight_kg;
    chargeable_weight_kg;
    volume_cbm;
    currency;
    payment_term;
    rate_per_kg;
    total_charges;
    booking_date;
    status;
    remarks;
    payment_status;
    amount_paid;
    payment_reference;
    payment_account;
    payment_account_id;
    payment_date;
    payment_confirmed_by;
    created_at;
    updated_at;
};
exports.CargoBooking = CargoBooking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CargoBooking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'awb_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], CargoBooking.prototype, "awb_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'origin', type: 'varchar', length: 3 }),
    __metadata("design:type", String)
], CargoBooking.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destination', type: 'varchar', length: 3 }),
    __metadata("design:type", String)
], CargoBooking.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipper_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CargoBooking.prototype, "shipper_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipper_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "shipper_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipper_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "shipper_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consignee_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CargoBooking.prototype, "consignee_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consignee_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "consignee_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'consignee_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "consignee_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commodity_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CargoBooking.prototype, "commodity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_handling_codes', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "special_handling_codes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pieces', type: 'int' }),
    __metadata("design:type", Number)
], CargoBooking.prototype, "pieces", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gross_weight_kg', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CargoBooking.prototype, "gross_weight_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chargeable_weight_kg', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CargoBooking.prototype, "chargeable_weight_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'volume_cbm', type: 'decimal', precision: 10, scale: 3, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "volume_cbm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], CargoBooking.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_term', type: 'varchar', length: 10, default: 'PREPAID' }),
    __metadata("design:type", String)
], CargoBooking.prototype, "payment_term", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "rate_per_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_charges', type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], CargoBooking.prototype, "total_charges", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_date', type: 'date' }),
    __metadata("design:type", Date)
], CargoBooking.prototype, "booking_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20, default: 'booked' }),
    __metadata("design:type", String)
], CargoBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar', length: 20, default: 'unpaid', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_paid', type: 'decimal', precision: 15, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "amount_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_account', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_account", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_account_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_confirmed_by', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], CargoBooking.prototype, "payment_confirmed_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CargoBooking.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CargoBooking.prototype, "updated_at", void 0);
exports.CargoBooking = CargoBooking = __decorate([
    (0, typeorm_1.Entity)('cargo_bookings')
], CargoBooking);
//# sourceMappingURL=cargo-booking.entity.js.map