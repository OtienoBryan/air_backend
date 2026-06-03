"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatReservationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const flight_entity_1 = require("../entities/flight.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const agent_entity_1 = require("../entities/agent.entity");
const country_entity_1 = require("../entities/country.entity");
const seat_reservations_service_1 = require("./seat-reservations.service");
const seat_reservations_controller_1 = require("./seat-reservations.controller");
let SeatReservationsModule = class SeatReservationsModule {
};
exports.SeatReservationsModule = SeatReservationsModule;
exports.SeatReservationsModule = SeatReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([seat_reservation_entity_1.SeatReservation, flight_series_entity_1.FlightSeries, flight_entity_1.Flight, passenger_entity_1.Passenger, agent_entity_1.Agent, country_entity_1.Country])],
        providers: [seat_reservations_service_1.SeatReservationsService],
        controllers: [seat_reservations_controller_1.SeatReservationsController],
        exports: [seat_reservations_service_1.SeatReservationsService]
    })
], SeatReservationsModule);
//# sourceMappingURL=seat-reservations.module.js.map