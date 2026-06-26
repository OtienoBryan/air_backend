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
const flight_series_entity_1 = require("./flight-series.entity");
const flight_entity_1 = require("./flight.entity");
let BookingPassenger = class BookingPassenger {
    id;
    booking_id;
    booking;
    flight_series_id;
    flightSeries;
    flight_id;
    flight;
    passenger_id;
    passenger;
    passenger_type;
    fare_amount;
    travel_date;
    leg;
    return_travel_date;
    return_flight_series_id;
    status;
    checked_in_at;
    boarded_at;
    seat_number;
    checkin_by;
    ticket_number;
    ticket_status;
    issued_at;
    payment_reference;
    payment_account;
    refund_amount;
    reschedule_fee;
    cancellation_reason;
    cancelled_at;
    cancelled_by;
    rescheduled_to_id;
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
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], BookingPassenger.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "flight", void 0);
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
    (0, typeorm_1.Column)({ name: 'travel_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "travel_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leg', type: 'varchar', length: 20, default: 'outbound' }),
    __metadata("design:type", String)
], BookingPassenger.prototype, "leg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_travel_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "return_travel_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "return_flight_series_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 30, nullable: true, default: 'confirmed' }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checked_in_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "checked_in_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'boarded_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "boarded_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seat_number', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "seat_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checkin_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "checkin_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_number', type: 'varchar', length: 20, nullable: true, unique: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "ticket_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ticket_status',
        type: 'enum',
        enum: ['OPEN', 'USED', 'VOID', 'REFUNDED', 'RESCHEDULED'],
        nullable: true,
        default: 'OPEN',
    }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "ticket_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "issued_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "payment_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_account', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "payment_account", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "refund_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reschedule_fee', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "reschedule_fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "cancellation_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "cancelled_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "cancelled_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rescheduled_to_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], BookingPassenger.prototype, "rescheduled_to_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BookingPassenger.prototype, "created_at", void 0);
exports.BookingPassenger = BookingPassenger = __decorate([
    (0, typeorm_1.Entity)('booking_passengers')
], BookingPassenger);
//# sourceMappingURL=booking-passenger.entity.js.map