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
exports.RouteLuggageSetting = void 0;
const typeorm_1 = require("typeorm");
const flight_route_entity_1 = require("./flight-route.entity");
let RouteLuggageSetting = class RouteLuggageSetting {
    id;
    route_id;
    route;
    type;
    weight_limit;
    extra_charge_per_kg;
    currency;
    created_at;
    updated_at;
};
exports.RouteLuggageSetting = RouteLuggageSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RouteLuggageSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', type: 'int' }),
    __metadata("design:type", Number)
], RouteLuggageSetting.prototype, "route_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_route_entity_1.FlightRoute, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", flight_route_entity_1.FlightRoute)
], RouteLuggageSetting.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'Checked Baggage' }),
    __metadata("design:type", String)
], RouteLuggageSetting.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_limit', type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], RouteLuggageSetting.prototype, "weight_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'extra_charge_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], RouteLuggageSetting.prototype, "extra_charge_per_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], RouteLuggageSetting.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RouteLuggageSetting.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RouteLuggageSetting.prototype, "updated_at", void 0);
exports.RouteLuggageSetting = RouteLuggageSetting = __decorate([
    (0, typeorm_1.Entity)('route_luggage_settings')
], RouteLuggageSetting);
//# sourceMappingURL=route-luggage-setting.entity.js.map