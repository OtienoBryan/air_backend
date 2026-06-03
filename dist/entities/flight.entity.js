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
exports.Flight = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const aircraft_entity_1 = require("./aircraft.entity");
let Flight = class Flight {
    id;
    series_id;
    series;
    aircraft_id;
    aircraft;
    aircraft_capacity;
    flight_no;
    flight_date;
    std;
    sta;
    status;
    is_extra;
    notes;
    created_at;
    updated_at;
};
exports.Flight = Flight;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Flight.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'series_id', type: 'int' }),
    __metadata("design:type", Number)
], Flight.prototype, "series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], Flight.prototype, "series", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aircraft_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "aircraft_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => aircraft_entity_1.Aircraft, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'aircraft_id' }),
    __metadata("design:type", Object)
], Flight.prototype, "aircraft", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aircraft_capacity', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "aircraft_capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_no', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Flight.prototype, "flight_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_date', type: 'date' }),
    __metadata("design:type", String)
], Flight.prototype, "flight_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'std', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "std", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sta', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "sta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20, default: 'scheduled' }),
    __metadata("design:type", String)
], Flight.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_extra', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], Flight.prototype, "is_extra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Flight.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Flight.prototype, "updated_at", void 0);
exports.Flight = Flight = __decorate([
    (0, typeorm_1.Entity)('flights')
], Flight);
//# sourceMappingURL=flight.entity.js.map