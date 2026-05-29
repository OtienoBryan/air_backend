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
exports.FlightCrew = void 0;
const typeorm_1 = require("typeorm");
const flight_series_entity_1 = require("./flight-series.entity");
const crew_entity_1 = require("./crew.entity");
let FlightCrew = class FlightCrew {
    id;
    flight_series_id;
    flightSeries;
    crew_id;
    crew;
    created_at;
};
exports.FlightCrew = FlightCrew;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightCrew.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int' }),
    __metadata("design:type", Number)
], FlightCrew.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_series_entity_1.FlightSeries),
    (0, typeorm_1.JoinColumn)({ name: 'flight_series_id' }),
    __metadata("design:type", flight_series_entity_1.FlightSeries)
], FlightCrew.prototype, "flightSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crew_id', type: 'int' }),
    __metadata("design:type", Number)
], FlightCrew.prototype, "crew_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crew_entity_1.Crew),
    (0, typeorm_1.JoinColumn)({ name: 'crew_id' }),
    __metadata("design:type", crew_entity_1.Crew)
], FlightCrew.prototype, "crew", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlightCrew.prototype, "created_at", void 0);
exports.FlightCrew = FlightCrew = __decorate([
    (0, typeorm_1.Entity)('flight_crew'),
    (0, typeorm_1.Unique)(['flight_series_id', 'crew_id'])
], FlightCrew);
//# sourceMappingURL=flight-crew.entity.js.map