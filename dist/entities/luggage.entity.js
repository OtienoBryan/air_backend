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
exports.Luggage = void 0;
const typeorm_1 = require("typeorm");
const passenger_entity_1 = require("./passenger.entity");
const flight_series_entity_1 = require("./flight-series.entity");
const booking_entity_1 = require("./booking.entity");
let Luggage = class Luggage {
    id;
    passenger_id;
    passenger;
    flight_series_id;
    flightSeries;
    flight_id;
    booking_id;
    booking;
    booking_reference;
    staff_id;
    tag_number;
    weight;
    excess_kg;
    excess_charge;
    collected;
    updated_by;
    created_at;
    updated_at;
};
exports.Luggage = Luggage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Luggage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int' }),
    __metadata("design:type", Number)
], Luggage.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], Luggage.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", Object)
], Luggage.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", Object)
], Luggage.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_reference', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "booking_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "staff_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "tag_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'excess_kg', type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Luggage.prototype, "excess_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'excess_charge', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Luggage.prototype, "excess_charge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Luggage.prototype, "collected", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Luggage.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Luggage.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Luggage.prototype, "updated_at", void 0);
exports.Luggage = Luggage = __decorate([
    (0, typeorm_1.Entity)('luggage')
], Luggage);
//# sourceMappingURL=luggage.entity.js.map