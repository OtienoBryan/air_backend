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
exports.FareHistory = void 0;
const typeorm_1 = require("typeorm");
const flight_route_entity_1 = require("./flight-route.entity");
let FareHistory = class FareHistory {
    id;
    route_id;
    route;
    adult_fare;
    child_fare;
    infant_fare;
    adult_return_fare;
    child_return_fare;
    infant_return_fare;
    fare_valid_from;
    fare_valid_to;
    changed_at;
};
exports.FareHistory = FareHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FareHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', type: 'int' }),
    __metadata("design:type", Number)
], FareHistory.prototype, "route_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_route_entity_1.FlightRoute),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", flight_route_entity_1.FlightRoute)
], FareHistory.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "adult_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "child_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "infant_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "adult_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "child_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "infant_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_valid_from', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "fare_valid_from", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_valid_to', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FareHistory.prototype, "fare_valid_to", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], FareHistory.prototype, "changed_at", void 0);
exports.FareHistory = FareHistory = __decorate([
    (0, typeorm_1.Entity)('fare_history')
], FareHistory);
//# sourceMappingURL=fare-history.entity.js.map