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
exports.FlightRoute = void 0;
const typeorm_1 = require("typeorm");
const destination_entity_1 = require("./destination.entity");
let FlightRoute = class FlightRoute {
    id;
    from_destination_id;
    fromDestination;
    to_destination_id;
    toDestination;
    via_destination_id;
    viaDestination;
    adult_fare;
    child_fare;
    infant_fare;
    adult_fare_origin_via;
    child_fare_origin_via;
    infant_fare_origin_via;
    adult_fare_via_destination;
    child_fare_via_destination;
    infant_fare_via_destination;
    currency;
    adult_return_fare_origin_via;
    child_return_fare_origin_via;
    infant_return_fare_origin_via;
    adult_return_fare_via_destination;
    child_return_fare_via_destination;
    infant_return_fare_via_destination;
    adult_return_fare;
    child_return_fare;
    infant_return_fare;
    fare_valid_from;
    fare_valid_to;
    route_type;
    status;
    created_at;
    updated_at;
};
exports.FlightRoute = FlightRoute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightRoute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_destination_id', type: 'int' }),
    __metadata("design:type", Number)
], FlightRoute.prototype, "from_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination),
    (0, typeorm_1.JoinColumn)({ name: 'from_destination_id' }),
    __metadata("design:type", destination_entity_1.Destination)
], FlightRoute.prototype, "fromDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_destination_id', type: 'int' }),
    __metadata("design:type", Number)
], FlightRoute.prototype, "to_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination),
    (0, typeorm_1.JoinColumn)({ name: 'to_destination_id' }),
    __metadata("design:type", destination_entity_1.Destination)
], FlightRoute.prototype, "toDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'via_destination_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "via_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'via_destination_id' }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "viaDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], FlightRoute.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_return_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_return_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_return_fare_origin_via', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_return_fare_origin_via", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_return_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_return_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_return_fare_via_destination', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_return_fare_via_destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "adult_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "child_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "infant_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_valid_from', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "fare_valid_from", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_valid_to', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FlightRoute.prototype, "fare_valid_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_type', type: 'varchar', length: 20, default: 'domestic' }),
    __metadata("design:type", String)
], FlightRoute.prototype, "route_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'active' }),
    __metadata("design:type", String)
], FlightRoute.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlightRoute.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FlightRoute.prototype, "updated_at", void 0);
exports.FlightRoute = FlightRoute = __decorate([
    (0, typeorm_1.Entity)('flight_routes')
], FlightRoute);
//# sourceMappingURL=flight-route.entity.js.map