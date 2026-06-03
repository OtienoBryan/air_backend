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
exports.SeatReservation = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const flight_entity_1 = require("./flight.entity");
const passenger_entity_1 = require("./passenger.entity");
const agent_entity_1 = require("./agent.entity");
const country_entity_1 = require("./country.entity");
let SeatReservation = class SeatReservation {
    id;
    flight_series_id;
    flightSeries;
    flight_id;
    flight;
    passenger_id;
    passenger;
    number_of_seats;
    passenger_name;
    passenger_title;
    passenger_email;
    passenger_phone;
    booking_reference;
    status;
    reservation_date;
    notes;
    agent_id;
    agent;
    country_id;
    id_type;
    id_number;
    id_expiry;
    id_issued_by;
    country;
    trip_type;
    return_flight_series_id;
    return_date;
    fare_amount;
    payment_status;
    amount_paid;
    created_at;
    updated_at;
};
exports.SeatReservation = SeatReservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SeatReservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int' }),
    __metadata("design:type", Number)
], SeatReservation.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], SeatReservation.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], SeatReservation.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_seats', type: 'int' }),
    __metadata("design:type", Number)
], SeatReservation.prototype, "number_of_seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SeatReservation.prototype, "passenger_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_title', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "passenger_title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "passenger_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "passenger_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_reference', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], SeatReservation.prototype, "booking_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 50,
        default: 'reserved'
    }),
    __metadata("design:type", String)
], SeatReservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reservation_date', type: 'date' }),
    __metadata("design:type", Date)
], SeatReservation.prototype, "reservation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agent_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "agent_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'agent_id' }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "country_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_type', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "id_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "id_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_expiry', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "id_expiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_issued_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "id_issued_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'country_id' }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trip_type', type: 'varchar', length: 20, default: 'one_way' }),
    __metadata("design:type", String)
], SeatReservation.prototype, "trip_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "return_flight_series_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "return_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fare_amount', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], SeatReservation.prototype, "fare_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar', length: 20, default: 'unpaid' }),
    __metadata("design:type", String)
], SeatReservation.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SeatReservation.prototype, "amount_paid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SeatReservation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SeatReservation.prototype, "updated_at", void 0);
exports.SeatReservation = SeatReservation = __decorate([
    (0, typeorm_1.Entity)('seat_reservations')
], SeatReservation);
//# sourceMappingURL=seat-reservation.entity.js.map