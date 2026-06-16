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
exports.RouteFareCharge = void 0;
const typeorm_1 = require("typeorm");
const flight_route_entity_1 = require("./flight-route.entity");
const chart_of_account_entity_1 = require("./chart-of-account.entity");
let RouteFareCharge = class RouteFareCharge {
    id;
    route_id;
    route;
    account_id;
    account;
    amount;
    currency;
    label;
    created_at;
    updated_at;
};
exports.RouteFareCharge = RouteFareCharge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RouteFareCharge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', type: 'int' }),
    __metadata("design:type", Number)
], RouteFareCharge.prototype, "route_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_route_entity_1.FlightRoute, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", flight_route_entity_1.FlightRoute)
], RouteFareCharge.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_id', type: 'int' }),
    __metadata("design:type", Number)
], RouteFareCharge.prototype, "account_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chart_of_account_entity_1.ChartOfAccount),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", chart_of_account_entity_1.ChartOfAccount)
], RouteFareCharge.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], RouteFareCharge.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], RouteFareCharge.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], RouteFareCharge.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RouteFareCharge.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RouteFareCharge.prototype, "updated_at", void 0);
exports.RouteFareCharge = RouteFareCharge = __decorate([
    (0, typeorm_1.Entity)('route_fare_charges')
], RouteFareCharge);
//# sourceMappingURL=route-fare-charge.entity.js.map