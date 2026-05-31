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
exports.FlightSeries = void 0;
const typeorm_1 = require("typeorm");
const aircraft_entity_1 = require("./aircraft.entity");
const destination_entity_1 = require("./destination.entity");
const flight_crew_entity_1 = require("./flight-crew.entity");
let FlightSeries = class FlightSeries {
    id;
    flt;
    aircraft_id;
    aircraft;
    flight_type;
    start_date;
    end_date;
    std;
    sta;
    number_of_seats;
    is_recurring;
    days_of_week;
    recurring_schedule;
    from_destination_id;
    fromDestination;
    from_terminal;
    to_terminal;
    via_destination_id;
    viaDestination;
    via_std;
    via_sta;
    to_destination_id;
    toDestination;
    adult_fare;
    child_fare;
    infant_fare;
    adult_return_fare;
    child_return_fare;
    infant_return_fare;
    flightCrew;
    created_at;
    updated_at;
};
exports.FlightSeries = FlightSeries;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightSeries.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FlightSeries.prototype, "flt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aircraft_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "aircraft_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => aircraft_entity_1.Aircraft),
    (0, typeorm_1.JoinColumn)({ name: 'aircraft_id' }),
    __metadata("design:type", aircraft_entity_1.Aircraft)
], FlightSeries.prototype, "aircraft", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FlightSeries.prototype, "flight_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], FlightSeries.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], FlightSeries.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'std', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "std", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sta', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "sta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_seats', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "number_of_seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_recurring', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], FlightSeries.prototype, "is_recurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'days_of_week', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "days_of_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurring_schedule', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "recurring_schedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_destination_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "from_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination),
    (0, typeorm_1.JoinColumn)({ name: 'from_destination_id' }),
    __metadata("design:type", destination_entity_1.Destination)
], FlightSeries.prototype, "fromDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_terminal', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "from_terminal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_terminal', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "to_terminal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'via_destination_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "via_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination),
    (0, typeorm_1.JoinColumn)({ name: 'via_destination_id' }),
    __metadata("design:type", destination_entity_1.Destination)
], FlightSeries.prototype, "viaDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'via_std', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "via_std", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'via_sta', type: 'time', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "via_sta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_destination_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "to_destination_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination),
    (0, typeorm_1.JoinColumn)({ name: 'to_destination_id' }),
    __metadata("design:type", destination_entity_1.Destination)
], FlightSeries.prototype, "toDestination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "adult_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "child_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "infant_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adult_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "adult_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'child_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "child_return_fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'infant_return_fare', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FlightSeries.prototype, "infant_return_fare", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_crew_entity_1.FlightCrew, flightCrew => flightCrew.flightSeries),
    __metadata("design:type", Array)
], FlightSeries.prototype, "flightCrew", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlightSeries.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], FlightSeries.prototype, "updated_at", void 0);
exports.FlightSeries = FlightSeries = __decorate([
    (0, typeorm_1.Entity)('flight_series')
], FlightSeries);
//# sourceMappingURL=flight-series.entity.js.map