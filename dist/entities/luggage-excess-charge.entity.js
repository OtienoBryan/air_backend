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
exports.LuggageExcessCharge = void 0;
const typeorm_1 = require("typeorm");
const passenger_entity_1 = require("./passenger.entity");
const flight_route_entity_1 = require("./flight-route.entity");
let LuggageExcessCharge = class LuggageExcessCharge {
    id;
    passenger_id;
    passenger;
    booking_id;
    flight_id;
    flight_series_id;
    route_id;
    route;
    total_weight;
    weight_limit;
    excess_kg;
    charge_per_kg;
    total_charge;
    currency;
    notes;
    created_at;
    updated_at;
};
exports.LuggageExcessCharge = LuggageExcessCharge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int' }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], LuggageExcessCharge.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "route_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_route_entity_1.FlightRoute, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_weight', type: 'decimal', precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "total_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_limit', type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "weight_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'excess_kg', type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "excess_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'charge_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "charge_per_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_charge', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LuggageExcessCharge.prototype, "total_charge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], LuggageExcessCharge.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], LuggageExcessCharge.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LuggageExcessCharge.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LuggageExcessCharge.prototype, "updated_at", void 0);
exports.LuggageExcessCharge = LuggageExcessCharge = __decorate([
    (0, typeorm_1.Entity)('luggage_excess_charges')
], LuggageExcessCharge);
//# sourceMappingURL=luggage-excess-charge.entity.js.map