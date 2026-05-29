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
exports.BookingPassenger = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const passenger_entity_1 = require("./passenger.entity");
let BookingPassenger = class BookingPassenger {
    id;
    booking_id;
    booking;
    passenger_id;
    passenger;
    passenger_type;
    fare_amount;
    created_at;
};
exports.BookingPassenger = BookingPassenger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BookingPassenger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', type: 'int' }),
    __metadata("design:type", Number)
], BookingPassenger.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", booking_entity_1.Booking)
], BookingPassenger.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int' }),
    __metadata("design:type", Number)
], BookingPassenger.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], BookingPassenger.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], BookingPassenger.prototype, "passenger_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BookingPassenger.prototype, "fare_amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BookingPassenger.prototype, "created_at", void 0);
exports.BookingPassenger = BookingPassenger = __decorate([
    (0, typeorm_1.Entity)('booking_passengers'),
    (0, typeorm_1.Unique)(['booking_id', 'passenger_id'])
], BookingPassenger);
//# sourceMappingURL=booking-passenger.entity.js.map