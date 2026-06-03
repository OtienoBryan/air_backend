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
exports.PassengerDisruption = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const flight_entity_1 = require("./flight.entity");
let PassengerDisruption = class PassengerDisruption {
    id;
    booking_id;
    booking;
    flight_id;
    flight;
    disruption_type;
    action_taken;
    created_at;
};
exports.PassengerDisruption = PassengerDisruption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PassengerDisruption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', type: 'int' }),
    __metadata("design:type", Number)
], PassengerDisruption.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", booking_entity_1.Booking)
], PassengerDisruption.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int' }),
    __metadata("design:type", Number)
], PassengerDisruption.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", flight_entity_1.Flight)
], PassengerDisruption.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'disruption_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PassengerDisruption.prototype, "disruption_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'action_taken', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], PassengerDisruption.prototype, "action_taken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PassengerDisruption.prototype, "created_at", void 0);
exports.PassengerDisruption = PassengerDisruption = __decorate([
    (0, typeorm_1.Entity)('passenger_disruptions')
], PassengerDisruption);
//# sourceMappingURL=passenger-disruption.entity.js.map