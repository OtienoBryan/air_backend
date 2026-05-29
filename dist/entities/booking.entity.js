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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const passenger_entity_1 = require("./passenger.entity");
const booking_passenger_entity_1 = require("./booking-passenger.entity");
let Booking = class Booking {
    id;
    booking_reference;
    flight_series_id;
    flightSeries;
    passenger_id;
    passenger;
    bookingPassengers;
    passenger_name;
    passenger_email;
    passenger_phone;
    passenger_type;
    number_of_passengers;
    fare_per_passenger;
    total_amount;
    payment_method;
    payment_status;
    booking_date;
    notes;
    created_at;
    updated_at;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_reference', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Booking.prototype, "booking_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], Booking.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], Booking.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_passenger_entity_1.BookingPassenger, bookingPassenger => bookingPassenger.booking),
    __metadata("design:type", Array)
], Booking.prototype, "bookingPassengers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Booking.prototype, "passenger_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "passenger_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "passenger_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Booking.prototype, "passenger_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_passengers', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Booking.prototype, "number_of_passengers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_per_passenger', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "fare_per_passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Booking.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], Booking.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_date', type: 'date' }),
    __metadata("design:type", Date)
], Booking.prototype, "booking_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Booking.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Booking.prototype, "updated_at", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
//# sourceMappingURL=booking.entity.js.map